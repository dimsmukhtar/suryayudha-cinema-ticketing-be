import cron from 'node-cron'
import { BookingStatus, SeatStatus } from '@prisma/client'
import { prisma } from '../../infrastructure/database/client'
import { logger } from '../../shared/utils/logger'

const cancelExpiredBookings = async () => {
  logger.info('Running cron job: Mencari booking yang kadaluarsa...')

  try {
    const expiredTransactions = await prisma.transaction.findMany({
      where: {
        booking_status: BookingStatus.initiated,
        booking_expires_at: {
          lt: new Date()
        }
      },
      include: {
        transaction_items: {
          select: {
            schedule_seat_id: true
          }
        }
      }
    })

    if (expiredTransactions.length === 0) {
      logger.info('Tidak ada booking yang kadaluarsa ditemukan')
      return
    }

    logger.warn(`Ditemukan ${expiredTransactions.length} booking yang kadaluarsa`)
    for (const transaction of expiredTransactions) {
      await prisma.$transaction(async (tx) => {
        const scheduleSeatIds = transaction.transaction_items.map((item) => item.schedule_seat_id)

        await tx.scheduleSeat.updateMany({
          where: {
            id: { in: scheduleSeatIds },
            status: SeatStatus.reserved
          },
          data: {
            status: SeatStatus.available
          }
        })

        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            booking_status: BookingStatus.cancelled,
            payment_type: 'cancelled',
            payment_status: 'cancelled'
          }
        })
      })
      logger.info(`Booking untuk transaksi ID ${transaction.id} berhasil dibatalkan`)
    }
  } catch (e) {
    logger.error('Terjadi error saat menjalankan cron job pembatalan booking:', e)
  }
}

export const scheduleBookingCancellationJob = () => {
  cron.schedule('* * * * *', cancelExpiredBookings)
  logger.info('✅ Cron job untuk pembatalan booking kadaluarsa telah dijadwalkan.')
}
