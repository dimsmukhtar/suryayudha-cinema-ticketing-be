import {
  Prisma,
  PrismaClient,
  SeatStatus,
  Transaction,
  TransactionStatus,
  TransactionType
} from '@prisma/client'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { BadRequestException } from '../../shared/error-handling/exceptions/bad-request.exception'
import { snap } from '../../shared/utils/midtrans'
import { sendEmail } from '../../shared/utils/nodemailer'
import { initiatePaymentTemplate } from '../../shared/helpers/emailTemplate'
import { queryGetAllTransactions, queryGetMyTransactions } from '../types/entities/TransactionTypes'

export class TransactionRepositoryPrisma {
  constructor(private readonly prisma: PrismaClient) {}

  async createBooking(
    scheduleId: number,
    userId: number,
    scheduleSeatIds: number[]
  ): Promise<Transaction> {
    if (!Array.isArray(scheduleSeatIds) || scheduleSeatIds.length === 0) {
      throw new BadRequestException('Pilihan kursi tidak boleh kosong')
    }
    return await this.prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.findFirst({
        where: {
          id: scheduleId
        }
      })
      const user = await tx.user.findUnique({
        where: {
          id: userId
        }
      })
      if (!schedule) {
        throw new NotFoundException(`Schedule dengan id ${scheduleId} tidak ditemukan`)
      }

      if (new Date() > schedule.start_time) {
        throw new BadRequestException('Pemesanan online untuk jadwal ini sudah ditutup')
      }

      if (schedule.finished_time < new Date()) {
        throw new BadRequestException('Jadwal film ini sudah berakhir')
      }

      if (user!.is_verified === false) {
        throw new BadRequestException('Email belum terverifikasi')
      }

      const totalBookingSeats = scheduleSeatIds.length
      const totalAmount = totalBookingSeats * schedule.price

      const availableSeats = await tx.scheduleSeat.findMany({
        where: {
          id: { in: scheduleSeatIds },
          schedule_id: scheduleId,
          status: SeatStatus.available
        },
        include: {
          seat: {
            select: {
              seat_label: true
            }
          }
        }
      })
      if (availableSeats.length !== totalBookingSeats) {
        throw new BadRequestException('Beberapa kursi yang Anda pilih sudah tidak tersedia')
      }

      await tx.scheduleSeat.updateMany({
        where: {
          id: { in: scheduleSeatIds }
        },
        data: {
          status: SeatStatus.reserved
        }
      })

      const now = new Date()
      const bookingExpiresAt = new Date(now.getTime() + 10 * 60 * 1000) // 10 menit

      const transaction = await tx.transaction.create({
        data: {
          total_amount: totalAmount,
          discount_amount: 0,
          final_amount: totalAmount,
          payment_type: 'not_initiated',
          type: TransactionType.booking,
          status: TransactionStatus.initiated,
          transaction_time: now,
          booking_expires_at: bookingExpiresAt,
          status_sort_order: 1,
          user_id: userId
        }
      })

      const seatLabelMap = new Map<number, string>()
      availableSeats.forEach((seat) => seatLabelMap.set(seat.id, seat.seat.seat_label))

      const transactionItemData = scheduleSeatIds.map((scheduleSeatId) => ({
        transaction_id: transaction.id,
        schedule_seat_id: scheduleSeatId,
        price: schedule.price,
        seat_label: seatLabelMap.get(scheduleSeatId) || 'N/A'
      }))

      await tx.transactionItem.createMany({
        data: transactionItemData
      })

      return transaction
    })
  }

  async getAllTransactions(query: queryGetAllTransactions): Promise<Transaction[]> {
    // filter by user email, order_id, status, date
    // status = ['pending', 'settlement', 'cancelled']
    const where: Prisma.TransactionWhereInput = {
      type: TransactionType.payment
    }
    if (query.email) {
      where.user = {
        email: query.email
      }
    }

    if (query.order_id) {
      where.order_id = query.order_id
    }

    if (query.status) {
      where.status = query.status
    }

    if (query.date) {
      const startDate = new Date(query.date)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 1)

      where.transaction_time = {
        gte: startDate,
        lt: endDate
      }
    }
    return await this.prisma.transaction.findMany({
      where: where,
      orderBy: [
        {
          status_sort_order: 'asc'
        },
        {
          transaction_time: 'desc'
        }
      ]
    })
  }

  async getAllBookings(): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany({
      where: {
        type: TransactionType.booking
      },
      orderBy: [
        {
          status_sort_order: 'asc'
        },
        {
          transaction_time: 'desc'
        }
      ]
    })
  }

  async getTransactionById(transactionId: number): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id: transactionId
      },
      include: {
        transaction_items: true
      }
    })
    if (!transaction) {
      throw new NotFoundException(`Transaksi dengan id ${transactionId} tidak ditemukan`)
    }
    return transaction
  }
  async getMyTransactions(userId: number, query: queryGetMyTransactions): Promise<Transaction[]> {
    const where: Prisma.TransactionWhereInput = {
      user_id: userId
    }
    if (query.type) {
      where.type = query.type
    }
    return await this.prisma.transaction.findMany({
      where: where,
      orderBy: [
        {
          status_sort_order: 'asc'
        },
        {
          transaction_time: 'desc'
        }
      ]
    })
  }

  async applyVoucherToTransaction(
    transactionId: number,
    voucherCode: string
  ): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: {
          id: transactionId
        }
      })

      if (!transaction) {
        throw new NotFoundException(`Transaksi dengan id ${transactionId} tidak ditemukan`)
      }

      if (transaction.voucher_id) {
        throw new BadRequestException('Voucher sudah diterapkan pada transaksi ini.')
      }

      if (transaction.status === 'cancelled') {
        throw new BadRequestException('Transaksi ini sudah dibatalkan')
      }

      if (transaction.status === 'settlement') {
        throw new BadRequestException('Transaksi ini sudah selesai')
      }
      const voucher = await tx.voucher.findUnique({
        where: {
          code: voucherCode
        }
      })

      if (!voucher) {
        throw new NotFoundException(`Voucher dengan kode ${voucherCode} tidak ditemukan`)
      }

      if (voucher.expires_at < new Date()) {
        throw new BadRequestException('Voucher sudah kadaluarsa')
      }

      if (voucher.usage_count >= voucher.usage_limit) {
        throw new BadRequestException('Voucher sudah tidak tersedia')
      }

      if (transaction.total_amount < voucher.min_purchase_amount) {
        throw new BadRequestException(
          `Minimum pembelian untuk voucher ini adalah Rp ${voucher.min_purchase_amount}`
        )
      }

      let calculatedDiscountAmount = 0

      if (voucher.type === 'percentage') {
        calculatedDiscountAmount = transaction.total_amount * (voucher.value / 100)
      } else {
        // fixed
        calculatedDiscountAmount = voucher.value
      }

      calculatedDiscountAmount = Math.min(calculatedDiscountAmount, transaction.total_amount)
      const finalAmount = transaction.total_amount - calculatedDiscountAmount

      await tx.voucher.update({
        where: {
          id: voucher.id
        },
        data: {
          usage_count: {
            increment: 1
          }
        }
      })

      const updatedTransaction = await tx.transaction.update({
        where: {
          id: transactionId
        },
        data: {
          voucher_id: voucher.id,
          discount_amount: calculatedDiscountAmount,
          final_amount: finalAmount
        }
      })
      return updatedTransaction
    })
  }

  async initiatePayment(transactionId: number, userId: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        user_id: userId
      },
      include: {
        user: true,
        transaction_items: {
          include: {
            schedule_seat: {
              include: {
                schedule: {
                  include: {
                    movie: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan atau bukan milik Anda')
    }
    if (transaction.status !== 'initiated') {
      throw new BadRequestException('Transaksi ini sudah di proses atau dibatalkan')
    }

    if (transaction.booking_expires_at < new Date()) {
      throw new BadRequestException('Waktu booking anda sudah habis, silahbkan buat booking baru')
    }

    const itemDetails = transaction.transaction_items.map((item) => ({
      id: item.id.toString(),
      price: item.price,
      quantity: 1,
      name: `Tiket Bioskop: ${item.schedule_seat.schedule.movie.title} (Kursi ${item.seat_label})`
    }))

    if (transaction.discount_amount > 0) {
      itemDetails.push({
        id: `VOUCHER-${transaction.voucher_id}`,
        price: -transaction.discount_amount,
        quantity: 1,
        name: 'Voucher Diskon'
      })
    }

    const now = new Date()
    const MIDTRANS_EXPIRY_MINUTES = 15 // 15 menit
    const paymentExpiresAt = new Date(now.getTime() + MIDTRANS_EXPIRY_MINUTES * 60 * 1000)

    const orderId = `ORDER-${transaction.id}-${Date.now()}`
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: transaction.final_amount
      },
      customer_details: {
        first_name: transaction.user.name,
        email: transaction.user.email
      },
      item_details: itemDetails,
      expiry: {
        unit: 'minutes',
        duration: MIDTRANS_EXPIRY_MINUTES // 15 menit
      }
    }

    const midtransResponse = await snap.createTransaction(parameter)
    const snapToken = midtransResponse.token
    const paymentUrl = midtransResponse.redirect_url

    await this.prisma.transaction.update({
      where: {
        id: transactionId
      },
      data: {
        order_id: orderId,
        payment_url: paymentUrl,
        status: TransactionStatus.pending,
        payment_expires_at: paymentExpiresAt,
        payment_type: 'midtrans',
        status_sort_order: 2,
        type: TransactionType.payment
      }
    })

    const emailHtml = initiatePaymentTemplate
      .replace('{{namaUser}}', transaction.user.name)
      .replace('{{paymentUrl}}', paymentUrl)
      .replace('{{paymentUrl}}', paymentUrl)
      .replace('{{orderId}}', orderId)
      .replace('{{judulFilm}}', transaction.transaction_items[0].schedule_seat.schedule.movie.title)
      .replace('{{jumlahTiket}}', transaction.transaction_items.length.toString())
      .replace('{{daftarKursi}}', transaction.transaction_items.map((i) => i.seat_label).join(', '))
      .replace('{{subTotal}}', `Rp ${transaction.total_amount.toLocaleString('id-ID')}`)
      .replace('{{discountAmount}}', `Rp ${transaction.discount_amount.toLocaleString('id-ID')}`)
      .replace('{{totalBayar}}', `Rp ${transaction.final_amount.toLocaleString('id-ID')}`)

    await sendEmail({
      email: transaction.user.email,
      subject: `Selesaikan Pembayaran Anda untuk Pesanan ${orderId}`,
      html: emailHtml
    })
    return { snapToken, paymentUrl }
  }
}
