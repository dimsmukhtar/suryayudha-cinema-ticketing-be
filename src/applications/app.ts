import express, { Application, Router } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import helmet from 'helmet'
import { cleanEnv, str, num } from 'envalid'
import { logger } from '@/shared/utils/logger'
import { Routes } from '@/Applications/routes/routes'
import { prisma } from '@/Infrastructure/database/client'
import { errorMiddleware } from '@/shared/error-handling/middleware/error.middleware'

class App {
  private app: Application
  private server?: ReturnType<Application['listen']>
  private readonly isProduction: boolean

  constructor() {
    this.app = express()
    this.isProduction = process.env.NODE_ENV === 'production'

    this.validateEnvironment()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
    this.initializeHealthCheck()
  }

  private validateEnvironment(): void {
    cleanEnv(process.env, {
      PORT: num({ default: 3000 }),
      NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
      DATABASE_URL: str(),
      NODEMAILER_APP_EMAIL: str(),
      NODEMAILER_APP_PASSWORD: str(),
      ACCESS_TOKEN_PRIVATE_KEY: str(),
      ACCESS_TOKEN_PUBLIC_KEY: str(),
      REFRESH_TOKEN_PRIVATE_KEY: str(),
      REFRESH_TOKEN_PUBLIC_KEY: str(),
      CORS_ORIGIN: str({ default: '*' })
    })
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet())
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        methods: ['GET', 'Head', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      })
    )
    this.app.use(morgan(this.isProduction ? 'combined' : 'dev'))
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeRoutes(): void {
    const routes = new Routes()
    this.app.use('/api', routes.routes)
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware)
  }

  private initializeHealthCheck(): void {
    this.app.get('/health', (_, res) => res.json({ status: 'OK' }))
    this.app.get('/health/db', async (_, res) => {
      try {
        await prisma.$queryRaw`SELECT 1`
        res.json({ database: 'OK' })
      } catch (error) {
        res.status(500).json({ database: 'Unhealthy' })
      }
    })
  }
}
