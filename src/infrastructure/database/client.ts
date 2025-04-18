import { PrismaClient } from '@prisma/client'
import { logger } from '@/shared/utils/logger'

class PrismaClientSingleton {
  private static instance: PrismaClient
  private static isProduction = process.env.NODE_ENV === 'production'

  static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient({
        log: [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'event' },
          { level: 'warn', emit: 'event' },
          { level: 'info', emit: 'event' }
        ]
      })
    }
    this.setupLogging()
    this.setupMiddlewares()

    return PrismaClientSingleton.instance
  }

  private static setupLogging(): void {
    PrismaClientSingleton.instance.$on('query', (e: any) => {
      logger.debug(`Query: ${e.query}`)
      logger.debug(`Params: ${e.params}`)
      logger.debug(`Duration: ${e.duration}ms`)
    })
    PrismaClientSingleton.instance.$on('error', (e: any) => {
      logger.error(`Prisma Error: ${e.message}`)
    })
    PrismaClientSingleton.instance.$on('warn', (e: any) => {
      logger.warn(`Prisma Warning: ${e.message}`)
    })
    PrismaClientSingleton.instance.$on('info', (e: any) => {
      logger.info(`Prisma Info: ${e.message}`)
    })
  }

  private static setupMiddlewares(): void {
    PrismaClientSingleton.instance.$use(async (params: any, next: any) => {
      const before = Date.now()
      try {
        const result = await next(params)
        const after = Date.now()

        logger.debug(`Query ${params.model}.${params.action} - ${after - before}ms`)
        return result
      } catch (error) {
        logger.error(`Database operation failed: ${error}`)
        throw error
      }
    })
  }
}

export const prisma = PrismaClientSingleton.getInstance()
