import { SeatStatus, TARGET_AUDIENCE, TransactionStatus } from '@prisma/client'
import { prisma } from '../../infrastructure/database/client'
import { logger } from '../../shared/utils/logger'

export const cancelExpiredBookings = async () => {
  logger.info('Running cron job: Mencari booking yang kadaluarsa...')

  try {
    const expiredBookings = await prisma.transaction.findMany({
      where: {
        status: TransactionStatus.initiated,
        booking_expires_at: {
          lt: new Date()
        }
      },
      include: {
        transaction_items: {
          include: {
            schedule_seat: {
              include: {
                schedule: {
                  include: {
                    movie: {
                      select: {
                        title: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    if (expiredBookings.length === 0) {
      logger.info('Tidak ada booking yang kadaluarsa ditemukan')
      return
    }

    logger.warn(`Ditemukan ${expiredBookings.length} booking yang kadaluarsa`)
    for (const transaction of expiredBookings) {
      await prisma.$transaction(async (tx) => {
        const movieTitle =
          transaction.transaction_items[0]?.schedule_seat.schedule.movie.title || 'Film'
        const seatLabels = transaction.transaction_items.map((item) => item.seat_label).join(', ')
        const notifDesc = `Booking Anda untuk film ${movieTitle} (kursi ${seatLabels}) telah dibatalkan karena anda tidak menindaklanjuti ke proses pembayaran dalam waktu 10 menit`
        const scheduleSeatIds = transaction.transaction_items.map((item) => item.schedule_seat_id)

        await tx.transactionItem.deleteMany({
          where: {
            transaction_id: transaction.id
          }
        })

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
            status: TransactionStatus.cancelled
          }
        })

        await tx.notification.create({
          data: {
            title: 'Booking Dibatalkan',
            description: notifDesc,
            target_audience: TARGET_AUDIENCE.spesific,
            notification_recipients: {
              create: {
                user_id: transaction.user_id
              }
            }
          }
        })
      })
      logger.info(`Booking untuk transaksi ID ${transaction.id} berhasil dibatalkan`)
    }
  } catch (e) {
    logger.error('Terjadi error saat menjalankan cron job pembatalan booking:', e)
  }
}
