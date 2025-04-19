import { Router } from 'express'
import { V1Routes } from './v1/v1Routes'

export class Routes {
  public readonly routes: Router
  private readonly v1Routes: V1Routes

  constructor() {
    this.routes = Router()
    this.v1Routes = new V1Routes()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // v1
    this.routes.use('/v1', this.v1Routes.v1Routes)
  }
}
