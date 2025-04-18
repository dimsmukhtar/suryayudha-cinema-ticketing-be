// File: src/applications/routes/v1/movie.routes.ts
import { Router } from 'express'
import { MovieController } from '@/applications/modules/Movie/movie.controller'
import { MovieValidation } from '@/applications/modules/Movie/movie.validation'

export class MovieRoutes {
  private readonly router: Router
  private readonly movieController: MovieController
  private readonly prefix = '/movies'

  constructor() {
    this.router = Router()
    this.movieController = new MovieController()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      // MovieValidation.validateCreateMovie, // Middleware validasi
      this.movieController.createMovie
    )
  }

  public getRouter(): Router {
    return this.router
  }
}
