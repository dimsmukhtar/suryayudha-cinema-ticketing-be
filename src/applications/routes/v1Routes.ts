import { Router } from 'express'
import { MovieController } from '../../applications/modules/Movie/movie.controller'

export class V1Routes {
  private readonly v1Routes: Router

  constructor() {
    this.v1Routes = Router()
    this.initializeV1Routes()
  }

  private initializeV1Routes(): void {
    const movieController = new MovieController()
    this.v1Routes.use('/movies', movieController.getMovieRoutes())
  }

  public getV1Routes(): Router {
    return this.v1Routes
  }
}
