import { Application } from 'express'
export interface IApp {
  app: Application
  server?: ReturnType<Application['listen']>
  isProduction: boolean
  validateEnvironment(): void
  initializeMiddlewares(): void
  initializeRoutes(): void
  initializeErrorHandling(): void
  initializeHealthCheck(): void
  start(): Promise<void>
  setupGracefulShutdown(): void
}
