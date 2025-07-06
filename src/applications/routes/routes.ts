import { Router } from 'express'
import {
  factoriesMovieController,
  factoriesCastController,
  factoriesGenreController,
  factoriesUserController
} from '../../infrastructure/factories/factories'
import { IRoutes } from 'infrastructure/types/route.type'

export class Routes {
  private readonly routes: Router
  private readonly movieRouter: IRoutes = factoriesMovieController()
  private readonly castRoutes: IRoutes = factoriesCastController()
  private readonly genreRoutes: IRoutes = factoriesGenreController()
  private readonly userRoutes: IRoutes = factoriesUserController()

  constructor() {
    this.routes = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.routes.use('/v1/movies', this.movieRouter.getRoutes())
    this.routes.use('/v1/casts', this.castRoutes.getRoutes())
    this.routes.use('/v1/genres', this.genreRoutes.getRoutes())
    this.routes.use('/v1/users', this.userRoutes.getRoutes())
  }

  public getRoutes(): Router {
    return this.routes
  }
}
