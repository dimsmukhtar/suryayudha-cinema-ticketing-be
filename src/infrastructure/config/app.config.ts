import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import { AppConfig, AppDependencies } from '../types/app.types'
import { logger } from '../../shared/utils/logger'
import { prisma } from '../database/client'

export const appConfig: AppConfig = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV as 'development' | 'production' | 'test',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  }
}

export const appDependencies: AppDependencies = {
  logger,
  database: prisma,
  security: {
    helmet: helmet(),
    cors: cors(appConfig.cors)
  },
  compression: compression(),
  requestLogger: morgan(appConfig.env === 'production' ? 'combined' : 'dev')
}
