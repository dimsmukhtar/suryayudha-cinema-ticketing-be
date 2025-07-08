import { Request, Response, NextFunction, Router } from 'express'
import { NotificationService } from './notification.service'
import { NotificationPayload } from '../../../infrastructure/types/entities/NotificationTypes'
import { authenticate } from '../../../shared/error-handling/middleware/authenticate'

export class NotificationController {
  private readonly notificationRouter: Router
  constructor(private readonly service: NotificationService) {
    this.notificationRouter = Router()
    this.initializeNotificationRoutes()
  }

  private initializeNotificationRoutes(): void {
    this.notificationRouter.get('/', this.getAllNotifications)
    this.notificationRouter.post('/', this.createNotification)
    this.notificationRouter.get('/my', authenticate, this.getMyNotifications)
    this.notificationRouter.post('/:id/my/mark', authenticate, this.markNofiticationAsRead)
    this.notificationRouter.delete('/:id/my/hide', authenticate, this.hideNotification)
  }

  private getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await this.service.getAllNotifications()
      res
        .status(200)
        .json({ success: true, message: 'Semua notifikasi berhasil diambil', data: notifications })
    } catch (e) {
      next(e)
    }
  }

  private createNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notificationCreatePayloadRequest: NotificationPayload = {
        ...req.body,
        ...(req.body.user_id && { user_id: parseInt(req.body.user_id) })
      }
      const notification = await this.service.createNotification(notificationCreatePayloadRequest)
      res
        .status(201)
        .json({ success: true, message: 'Notifikasi berhasil dibuat', data: notification })
    } catch (e) {
      next(e)
    }
  }

  private getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await this.service.getMyNotifications(req.user!.id)
      res
        .status(200)
        .json({ success: true, message: 'Semua notifikasi berhasil diambil', data: notifications })
    } catch (e) {
      next(e)
    }
  }

  private markNofiticationAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notificationId = parseInt(req.params.id)
      const userId = req.user!.id
      await this.service.markNofiticationAsRead(userId, notificationId)
      res.status(200).json({ success: true, message: 'Notifikasi berhasil dibaca' })
    } catch (e) {
      next(e)
    }
  }

  private hideNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notificationId = parseInt(req.params.id)
      const userId = req.user!.id
      await this.service.hideNotification(userId, notificationId)
      res.status(200).json({ success: true, message: 'Notifikasi berhasil dihapus' })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.notificationRouter
  }
}
