import { Notification, PrismaClient } from '@prisma/client'
import { NotificationPayload, NotificationWithIsRead } from '../types/entities/NotificationTypes'

export class NotificationRepositoryPrisma {
  constructor(private readonly prisma: PrismaClient) {}

  async createNotification(notificationData: NotificationPayload): Promise<Notification> {
    const { user_id, ...restNotificationData } = notificationData
    return await this.prisma.notification.create({
      data: user_id
        ? {
            ...restNotificationData,
            notification_recipients: {
              create: {
                user_id: user_id
              }
            }
          }
        : notificationData
    })
  }
  async getAllNotifications(): Promise<Notification[]> {
    return await this.prisma.notification.findMany()
  }

  async getMyNotifications(userId: number): Promise<NotificationWithIsRead[]> {
    const notificationsFromDb = await this.prisma.notification.findMany({
      where: {
        OR: [
          {
            target_audience: 'all'
          },
          {
            notification_recipients: {
              some: {
                user_id: userId
              }
            }
          }
        ]
      },
      include: {
        user_notification_reads: {
          where: {
            user_id: userId
          },
          take: 1
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    const notifications = notificationsFromDb.map((notif) => {
      const { user_notification_reads, ...restOfNotification } = notif

      return {
        ...restOfNotification,
        is_read: user_notification_reads.length > 0
      }
    })

    return notifications
  }
}
