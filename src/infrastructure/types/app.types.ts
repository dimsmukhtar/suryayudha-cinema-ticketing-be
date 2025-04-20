import { PrismaClient } from '@prisma/client'
import { Application, ErrorRequestHandler, RequestHandler, Router } from 'express'
import { Logger } from 'winston'
export interface IApp {
  start(): Promise<void>
  getApp(): Application
}

export interface AppConfig {
  port: number
  env: 'development' | 'production' | 'test'
  cors: {
    origin: string | RegExp | (string | RegExp)[]
    methods?: string[]
    allowedHeaders?: string[]
    credentials: boolean
  }
}

export interface AppDependencies {
  logger: Logger
  database: PrismaClient
  security: {
    helmet: RequestHandler
    cors: RequestHandler
  }
  compression: RequestHandler
  requestLogger: RequestHandler
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

export interface RouteConfig {
  path: string
  router: Router
  middlewares?: RequestHandler[]
}

export interface ErrorHandlerConfig {
  handlers: {
    notFound: RequestHandler
    validation: ErrorRequestHandler
    server: ErrorRequestHandler
    database: ErrorRequestHandler
  }
}
