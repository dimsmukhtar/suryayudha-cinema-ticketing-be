import { Router } from 'express'
import {
  factoriesMovieController,
  factoriesCastController,
  factoriesGenreController,
  factoriesUserController,
  factoriesNotificationController,
  factoriesStudioController,
  factoriesScheduleController,
  factoriesVoucherController,
  factoriesTransactionController,
  factoriesTicketController,
  factoriesDashboardController,
  factoriesAuthController
} from '../../infrastructure/factories/factories'
import { IRoutes } from '@infrastructure/types/route.type'
import { WebhookController } from '../../applications/modules/Webhook/webhook.controller'

const webhookController = new WebhookController()

export class Routes {
  private readonly routes: Router
  private readonly movieRouter: IRoutes = factoriesMovieController()
  private readonly castRoutes: IRoutes = factoriesCastController()
  private readonly genreRoutes: IRoutes = factoriesGenreController()
  private readonly userRoutes: IRoutes = factoriesUserController()
  private readonly notificationRoutes: IRoutes = factoriesNotificationController()
  private readonly studioRoutes: IRoutes = factoriesStudioController()
  private readonly scheduleRoutes: IRoutes = factoriesScheduleController()
  private readonly voucherRoutes: IRoutes = factoriesVoucherController()
  private readonly transactionRoutes: IRoutes = factoriesTransactionController()
  private readonly webhookRoutes: IRoutes = webhookController
  private readonly ticketRoutes: IRoutes = factoriesTicketController()
  private readonly dashboardRoutes: IRoutes = factoriesDashboardController()
  private readonly authRoutes: IRoutes = factoriesAuthController()

  constructor() {
    this.routes = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.routes.use('/v1/auth', this.authRoutes.getRoutes())
    this.routes.use('/v1/users', this.userRoutes.getRoutes())
    this.routes.use('/v1/genres', this.genreRoutes.getRoutes())
    this.routes.use('/v1/casts', this.castRoutes.getRoutes())
    this.routes.use('/v1/movies', this.movieRouter.getRoutes())
    this.routes.use('/v1/notifications', this.notificationRoutes.getRoutes())
    this.routes.use('/v1/studios', this.studioRoutes.getRoutes())
    this.routes.use('/v1/schedules', this.scheduleRoutes.getRoutes())
    this.routes.use('/v1/vouchers', this.voucherRoutes.getRoutes())
    this.routes.use('/v1/transactions', this.transactionRoutes.getRoutes())
    this.routes.use('/webhooks', this.webhookRoutes.getRoutes())
    this.routes.use('/v1/tickets', this.ticketRoutes.getRoutes())
    this.routes.use('/v1/dashboard', this.dashboardRoutes.getRoutes())
  }

  public getRoutes(): Router {
    return this.routes
  }
}
