import { Notification, UserNotificationReads } from '@prisma/client'
import { NotificationRepositoryPrisma } from '../../../infrastructure/repositories/NotificationRepositoryPrisma'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import {
  NotificationPayload,
  NotificationWithIsRead
} from '../../../infrastructure/types/entities/NotificationTypes'
import { NotificationValidation } from './notification.validation'
import { ZodValidation } from '../../../shared/middlewares/validation.middleware'
import { BadRequestException } from '../../../shared/error-handling/exceptions/bad-request.exception'

export class NotificationService {
  constructor(private readonly repository: NotificationRepositoryPrisma) {}

  async getAllNotifications(): Promise<Notification[]> {
    try {
      return await this.repository.getAllNotifications()
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat notifikasi'
      })
    }
  }

  async createNotification(notificationData: NotificationPayload): Promise<Notification> {
    try {
      if (notificationData.target_audience === 'spesific' && !notificationData.user_id) {
        throw new BadRequestException('Jika target audience spesific, User ID harus diisi!')
      }
      const notificationPayloadRequest = ZodValidation.validate(
        NotificationValidation.CREATE,
        notificationData
      )
      return await this.repository.createNotification(notificationPayloadRequest)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat notifikasi'
      })
    }
  }

  async getMyNotifications(userId: number): Promise<NotificationWithIsRead[]> {
    try {
      return await this.repository.getMyNotifications(userId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil notifikasi'
      })
    }
  }

  async markNofiticationAsRead(
    userId: number,
    notificationId: number
  ): Promise<UserNotificationReads> {
    try {
      return await this.repository.markNofiticationAsRead(userId, notificationId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membaca notifikasi'
      })
    }
  }
}
