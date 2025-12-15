import { Router, Request, Response, NextFunction } from 'express'
import { DashboardService } from './dashboard.service'

export class DashboardController {
  private readonly dashboardRouter: Router
  constructor(private readonly service: DashboardService) {
    this.dashboardRouter = Router()
    this.initializeDashboardRoutes()
  }

  private initializeDashboardRoutes() {
    this.dashboardRouter.get('/admin-stats', this.getDashboardStats)
    this.dashboardRouter.get('/admin-chart', this.getRevenueChart)
  }

  private getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.service.getDashboardStats()
      res
        .status(200)
        .json({ success: true, message: 'Statistik dashboard berhasil diambil', data: stats })
    } catch (e) {
      next(e)
    }
  }

  private getRevenueChart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date()
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : new Date(new Date().setDate(endDate.getDate() - 6))

      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)

      const chartData = await this.service.getRevenueChartData(startDate, endDate)
      res
        .status(200)
        .json({ success: true, message: 'Data grafik berhasil diambil', data: chartData })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.dashboardRouter
  }
}
