import { DashboardRepositoryPrisma } from '@infrastructure/repositories/DashboardRepositoryPrisma'
import { CustomHandleError } from '@shared/error-handling/middleware/custom-handle'

export class DashboardService {
  constructor(private readonly repository: DashboardRepositoryPrisma) {}

  async getDashboardStats() {
    try {
      return await this.repository.getDashboardStats()
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil data dashboard stats'
      })
    }
  }

  async getRevenueChartData(startDate: Date, endDate: Date) {
    try {
      return await this.repository.getRevenueChartData(startDate, endDate)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil data dashboard chart'
      })
    }
  }
}
