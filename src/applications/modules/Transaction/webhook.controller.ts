import { Request, Response } from 'express'
import { snap } from '../../../shared/utils/midtrans'
import { prisma } from '../../../infrastructure/database/client'
import { BookingStatus, SeatStatus, TicketStatus } from '@prisma/client'
import { generateRandomCode } from '../../../shared/helpers/randomCode'

export const midtransWebhookHandler = async (req: Request, res: Response) => {
  try {
    const notificationJson = req.body

    const statusResponse = await snap.transaction.notification(notificationJson)
    const orderId = statusResponse.order_id
    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status

    const transaction = await prisma.transaction.findFirst({
      where: {
        order_id: orderId
      },
      include: {
        transaction_items: true
      }
    })

    if (!transaction) {
      return res.status(404).send('Transaction not found')
    }

    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
      if (fraudStatus == 'accept') {
        await prisma.$transaction(async (tx) => {
          await tx.transaction.update({
            where: {
              id: transaction.id
            },
            data: {
              booking_status: BookingStatus.settlement,
              payment_status: transactionStatus
            }
          })
          const scheduleSeatIds = transaction.transaction_items.map((item) => item.schedule_seat_id)
          await tx.scheduleSeat.updateMany({
            where: {
              id: {
                in: scheduleSeatIds
              }
            },
            data: {
              status: SeatStatus.booked
            }
          })

          const ticketData = transaction.transaction_items.map((item) => {
            const randomCode = generateRandomCode(5)
            return {
              code: `TICKET-${transaction.id}-${item.id}-${randomCode}`,
              status: TicketStatus.active,
              transaction_item_id: item.id
            }
          })

          await tx.ticket.createMany({
            data: ticketData
          })
        })
      } else if (
        transactionStatus == 'cancel' ||
        transactionStatus == 'deny' ||
        transactionStatus == 'expire'
      ) {
        await prisma.$transaction(async (tx) => {
          await tx.transaction.update({
            where: {
              id: transaction.id
            },
            data: {
              booking_status: BookingStatus.cancelled,
              payment_status: transactionStatus
            }
          })

          const scheduleSeatIds = transaction.transaction_items.map((item) => item.schedule_seat_id)
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
        })
      }
    }
    res.status(200).send('OK')
  } catch (e) {
    console.error('Webhook processing error:', e)
    res.status(500).send('Internal Server Error')
  }
}
