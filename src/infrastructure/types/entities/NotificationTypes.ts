import { Notification } from '@prisma/client'

export type NotificationPayload = {
  title: string
  description: string
  target_audience: 'all' | 'spesific'
  user_id?: number
}

export type NotificationWithIsRead = Omit<Notification, 'user_notification_reads'> & {
  is_read: boolean
}
