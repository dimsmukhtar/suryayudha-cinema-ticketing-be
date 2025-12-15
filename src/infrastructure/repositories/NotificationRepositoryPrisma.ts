import { Notification, PrismaClient, UserNotificationReads } from '@prisma/client'
import {
  INotificationRepository,
  NotificationPayload,
  NotificationWithIsRead
} from '../types/entities/NotificationTypes'
import { checkExists } from '@shared/helpers/checkExistingRow'

export class NotificationRepositoryPrisma implements INotificationRepository {
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
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    const notificationsFromDb = await this.prisma.notification.findMany({
      where: {
        created_at: {
          gt: user?.created_at
        },
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
        ],
        user_notification_hides: {
          none: {
            user_id: userId
          }
        }
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

  async markNofiticationAsRead(
    userId: number,
    notificationId: number
  ): Promise<UserNotificationReads> {
    await checkExists(this.prisma.notification, notificationId, 'Notifikasi')
    return await this.prisma.userNotificationReads.upsert({
      where: {
        notification_id_user_id: {
          user_id: userId,
          notification_id: notificationId
        }
      },
      create: {
        user_id: userId,
        notification_id: notificationId
      },
      update: {}
    })
  }

  async hideNotification(userId: number, notificationId: number) {
    await checkExists(this.prisma.notification, notificationId, 'Notifikasi')
    return this.prisma.userNotificationHides.createMany({
      data: {
        user_id: userId,
        notification_id: notificationId
      },
      skipDuplicates: true
    })
  }
}
