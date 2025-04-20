import { Router } from 'express'
import { V1Routes } from './v1Routes'

export class Routes {
  public readonly routes: Router

  constructor() {
    this.routes = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    const v1Routes = new V1Routes()
    this.routes.use('/v1', v1Routes.getV1Routes())
  }
}
