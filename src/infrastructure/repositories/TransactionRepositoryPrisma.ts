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
        throw new BadRequestException(
          'Beberapa kursi yang Anda pilih sudah tidak tersedia. Silakan pilih ulang.'
        )
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
}
