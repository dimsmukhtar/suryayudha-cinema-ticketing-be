import { BookingStatus, PrismaClient, SeatStatus, Transaction } from '@prisma/client'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { BadRequestException } from '../../shared/error-handling/exceptions/bad-request.exception'

export class TransactionRepositoryPrisma {
  constructor(private readonly prisma: PrismaClient) {}

  async createBooking(scheduleId: number, userId: number, seatIds: number[]): Promise<Transaction> {
    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      throw new BadRequestException('Kursi tidak boleh kosong')
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

      const totalBookingSeats = seatIds.length
      const totalAmount = totalBookingSeats * schedule.price

      const seatsAvailable = await tx.scheduleSeat.count({
        where: {
          schedule_id: scheduleId,
          status: SeatStatus.available
        }
      })
      if (seatsAvailable < totalBookingSeats) {
        throw new NotFoundException('Kursi sedang penuh')
      }
      const seats = await tx.scheduleSeat.findMany({
        where: {
          schedule_id: scheduleId,
          id: { in: seatIds },
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
      if (seats.length !== totalBookingSeats) {
        throw new BadRequestException('Beberapa kursi sudah tidak tersedia')
      }

      await tx.scheduleSeat.updateMany({
        where: {
          schedule_id: scheduleId,
          id: { in: seatIds }
        },
        data: {
          status: SeatStatus.booked
        }
      })

      const now = new Date()
      const bookingExpiresAt = new Date(now.getTime() + 10 * 60 * 1000) // 10 menit

      const transaction = await tx.transaction.create({
        data: {
          total_amount: totalAmount,
          discount_amount: 0,
          final_amount: totalAmount,
          payment_type: 'booking',
          payment_status: 'not_initiated',
          booking_status: BookingStatus.initiated,
          transaction_time: now,
          booking_expires_at: bookingExpiresAt,
          user_id: userId
        }
      })

      await tx.transactionItem.createMany({
        data: seatIds.map((seatId) => ({
          transaction_id: transaction.id,
          schedule_seat_id: seatId,
          price: schedule.price,
          seat_label: seats.find((seat) => seat.id === seatId)!.seat.seat_label
        }))
      })

      return transaction
    })
  }
}
