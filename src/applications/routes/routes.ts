import { Router } from 'express'
import {
  createMovieController,
  createCastController
} from '../../infrastructure/factories/factories'
import { IRoutes } from 'infrastructure/types/route.type'

export class Routes {
  private readonly routes: Router
  private readonly movieRouter: IRoutes = createMovieController()
  private readonly castRoutes: IRoutes = createCastController()

  constructor() {
    this.routes = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.routes.use('/v1/movies', this.movieRouter.getRoutes())
    this.routes.use('/v1/casts', this.castRoutes.getRoutes())
  }

  public getRoutes(): Router {
    return this.routes
  }
}
