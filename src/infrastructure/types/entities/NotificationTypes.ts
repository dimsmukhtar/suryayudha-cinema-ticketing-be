import { Notification, UserNotificationReads } from '@prisma/client'

export type NotificationPayload = {
  title: string
  description: string
  target_audience: 'all' | 'spesific'
  user_id?: number
}

export type NotificationWithIsRead = Omit<Notification, 'user_notification_reads'> & {
  is_read: boolean
}

export interface INotificationRepository {
  createNotification(notificationData: NotificationPayload): Promise<Notification>
  getAllNotifications(): Promise<Notification[]>
  getMyNotifications(userId: number): Promise<NotificationWithIsRead[]>
  markNofiticationAsRead(userId: number, notificationId: number): Promise<UserNotificationReads>
}
