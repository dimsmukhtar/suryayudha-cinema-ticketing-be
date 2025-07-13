import { Request, Response, NextFunction, Router } from 'express'

import { ScheduleService } from './schedule.service'
import { SchedulePayload } from '../../../infrastructure/types/entities/ScheduleTypes'
import { authenticate } from '../../../shared/error-handling/middleware/authenticate'

export class ScheduleController {
  private readonly scheduleRouter: Router
  constructor(private readonly service: ScheduleService) {
    this.scheduleRouter = Router()
    this.initializeScheduleRoutes()
  }

  private initializeScheduleRoutes(): void {
    this.scheduleRouter.post('/', authenticate, this.createSchedule)
    this.scheduleRouter.get('/', this.getAllSchedules)
    this.scheduleRouter.get('/:id', this.getScheduleById)
    this.scheduleRouter.delete('/:id', this.deleteSchedule)
    this.scheduleRouter.get('/:id/seats', this.getScheduleLayout)
    this.scheduleRouter.put('/seats/:id', this.updateScheduleSeatStatus)
  }

  private createSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createSchedulePayload: SchedulePayload = {
        ...req.body,
        price: parseInt(req.body.price),
        movie_id: parseInt(req.body.movie_id)
      }
      const userId = req.user!.id
      const schedule = await this.service.createSchedule(createSchedulePayload, userId)
      res.status(201).json({ success: true, message: 'Scedule berhasil dibuat', data: schedule })
    } catch (e) {
      next(e)
    }
  }

  private getAllSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schedules = await this.service.getAllSchedules(req.query)
      res
        .status(200)
        .json({ success: true, message: 'Semua schedule berhasil diambil', data: schedules })
    } catch (e) {
      next(e)
    }
  }
  private getScheduleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schedule = await this.service.getScheduleById(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Schedule berhasil diambil', data: schedule })
    } catch (e) {
      next(e)
    }
  }

  private deleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteSchedule(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Schedule berhasil dihapus' })
    } catch (e) {
      next(e)
    }
  }

  private getScheduleLayout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schedule = await this.service.getScheduleLayout(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Schedule Seats diambil', data: schedule })
    } catch (e) {
      next(e)
    }
  }

  private updateScheduleSeatStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schedule = await this.service.updateScheduleSeatStatus(
        parseInt(req.params.id),
        req.body.status
      )
      res
        .status(200)
        .json({ success: true, message: 'Schedule Seat status berhasil di update', data: schedule })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.scheduleRouter
  }
}
