import { Router } from 'express'
import { MovieController } from '../../../applications/modules/Movie/movie.controller'

export class V1Routes {
  public readonly v1Routes: Router
  private readonly movieController = new MovieController()

  constructor() {
    this.v1Routes = Router()
    this.initializeV1Routes()
  }

  private initializeV1Routes(): void {
    this.v1Routes.use('/movies', this.movieController.movieRouter)
  }
}
