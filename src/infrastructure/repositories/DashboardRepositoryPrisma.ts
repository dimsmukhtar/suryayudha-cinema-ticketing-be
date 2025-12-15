import { PrismaClient, TransactionStatus } from '@prisma/client'

export class DashboardRepositoryPrisma {
  constructor(private readonly prisma: PrismaClient) {}

  async getDashboardStats() {
    const [totalRevenue, totalTicketsSold, totalMovies, totalUsers, recentTransactions] =
      await Promise.all([
        this.prisma.transaction.aggregate({
          _sum: {
            final_amount: true
          },
          where: {
            status: TransactionStatus.settlement
          }
        }),
        this.prisma.ticket.count(),

        this.prisma.movie.count(),

        this.prisma.user.count({ where: { role: 'user' } }),

        this.prisma.transaction.findMany({
          where: {
            status: TransactionStatus.settlement
          },
          take: 5,
          orderBy: {
            updated_at: 'desc'
          },
          include: {
            user: { select: { name: true, email: true } }
          }
        })
      ])

    return {
      totalRevenue: totalRevenue._sum.final_amount || 0,
      totalTicketsSold,
      totalMovies,
      totalUsers,
      recentTransactions
    }
  }

  async getRevenueChartData(
    startDate: Date,
    endDate: Date
  ): Promise<{ date: string; revenue: number }[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        status: 'settlement',
        updated_at: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        final_amount: true,
        updated_at: true
      }
    })

    const dailyRevenue = new Map<string, number>()

    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0]
      dailyRevenue.set(dateString, 0)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    transactions.forEach((trx) => {
      const dateString = trx.updated_at!.toISOString().split('T')[0]
      const currentRevenue = dailyRevenue.get(dateString) || 0
      dailyRevenue.set(dateString, currentRevenue + trx.final_amount)
    })

    const chartData = Array.from(dailyRevenue.entries())
      .map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        revenue
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return chartData
  }
}
