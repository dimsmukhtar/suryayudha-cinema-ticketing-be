import { BookingStatus, PrismaClient, SeatStatus, Transaction } from '@prisma/client'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { BadRequestException } from '../../shared/error-handling/exceptions/bad-request.exception'

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
      if (!schedule) {
        throw new NotFoundException(`Schedule dengan id ${scheduleId} tidak ditemukan`)
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
          payment_type: 'pending',
          payment_status: 'not_initiated',
          booking_status: BookingStatus.initiated,
          transaction_time: now,
          booking_expires_at: bookingExpiresAt,
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

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany()
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
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await this.prisma.transaction.findMany({
      where: {
        user_id: userId
      }
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
}
