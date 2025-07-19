import { SeatStatus, TARGET_AUDIENCE, TransactionStatus } from '@prisma/client'
import { prisma } from '../../infrastructure/database/client'
import { logger } from '../../shared/utils/logger'
import { sendEmail } from '../../shared/utils/nodemailer'
import { paymentCancelledTemplate } from '../../shared/helpers/emailTemplate'

export const cancelExpiredPayments = async () => {
  logger.info('Running cron job: Mencari payments dari midtrans yang kadaluarsa...')

  try {
    const expiredPayments = await prisma.transaction.findMany({
      where: {
        status: TransactionStatus.pending,
        payment_expires_at: {
          lt: new Date()
        }
      },
      include: {
        user: true,
        transaction_items: {
          include: {
            schedule_seat: {
              include: {
                schedule: {
                  include: {
                    movie: true,
                    studio: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (expiredPayments.length === 0) {
      logger.info('Tidak ada payments dari midtrans yang kadaluarsa ditemukan')
      return
    }

    logger.warn(`Ditemukan ${expiredPayments.length} payment dari midtrans yang kadaluarsa`)

    for (const transaction of expiredPayments) {
      await prisma.$transaction(async (tx) => {
        const movieTitle =
          transaction.transaction_items[0]?.schedule_seat.schedule.movie.title || 'Film'
        const seatLabels = transaction.transaction_items.map((item) => item.seat_label).join(', ')
        const notifDesc = `Pemesanan tiket Anda untuk ${movieTitle} (Kursi ${seatLabels}) telah dibatalkan karena pembayaran tidak berhasil diselesaikan atau telah melewati batas waktu yaitu 15 menit.`
        const scheduleSeatIds = transaction.transaction_items.map((item) => item.schedule_seat_id)

        await tx.transactionItem.deleteMany({
          where: {
            transaction_id: transaction.id
          }
        })

        await tx.scheduleSeat.updateMany({
          where: {
            id: {
              in: scheduleSeatIds
            }
          },
          data: {
            status: SeatStatus.available
          }
        })

        await tx.transaction.update({
          where: {
            id: transaction.id
          },
          data: {
            status: TransactionStatus.cancelled
          }
        })

        await tx.notification.create({
          data: {
            title: 'Pembayaran dibatalkan',
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
      const scheduleSeatLabels = transaction.transaction_items
        .map((item) => item.seat_label)
        .join(', ')

      const emailHtml = paymentCancelledTemplate
        .replace('{{namaUser}}', transaction.user.name)
        .replace(
          '{{linkHalamanFilm}}',
          `${process.env.CLIENT_URL}/movies/${transaction.transaction_items[0].schedule_seat.schedule.movie_id}`
        )
        .replace(
          '{{judulFilm}}',
          transaction.transaction_items[0].schedule_seat.schedule.movie.title
        )
        .replace('{{jumlahTiket}}', transaction.transaction_items.length.toString())
        .replace('{{subTotal}}', `Rp ${transaction.total_amount.toLocaleString('id-ID')}`)
        .replace('{{discountAmount}}', `Rp ${transaction.discount_amount.toLocaleString('id-ID')}`)
        .replace('{{daftarKursi}}', scheduleSeatLabels)
        .replace('{{orderId}}', transaction.order_id || 'N/A')
        .replace('{{totalBayar}}', `Rp ${transaction.final_amount.toLocaleString('id-ID')}`)

      await sendEmail({
        email: transaction.user.email,
        subject: 'Pembayaran Anda telah dibatalkan',
        html: emailHtml
      })

      logger.info(`Payment midtrans untuk transaksi ID ${transaction.id} berhasil dibatalkan`)
    }
  } catch (e) {
    logger.error('Terjadi error saat menjalankan cron job pembatalan payments dari midtrans:', e)
  }
}
