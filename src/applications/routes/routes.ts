import { Router } from 'express'
import { createMovieController } from '../../infrastructure/factories/factories'

interface ControllerRouter {
  getRoutes(): Router
}
export class Routes {
  private readonly routes: Router
  private readonly movieRouter: ControllerRouter = createMovieController()

  constructor() {
    this.routes = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.routes.use('/v1/movies', this.movieRouter.getRoutes())
  }

  public getRoutes(): Router {
    return this.routes
  }
}
