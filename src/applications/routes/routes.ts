// File: src/applications/routes/routes.ts
import { Router } from 'express'
import { V1Routes } from './v1/routes'

export class Routes {
  private router: Router
  private readonly v1Routes: V1Routes

  constructor() {
    this.router = Router()
    this.v1Routes = new V1Routes()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // Mount versioned routes
    this.router.use(this.v1Routes.getRouter())
  }

  public getRouter(): Router {
    return this.router
  }
}
