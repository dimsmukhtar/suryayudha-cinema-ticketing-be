import express, { Request, Response, NextFunction, RequestHandler, Router } from 'express'
import { MovieService } from './movie.service'
import { CreateMovieDto, MovieValidation } from './movie.validation'
import { validateResource } from '../../../shared/middlewares/validation.middleware'

export class MovieController {
  public readonly movieRouter: Router

  constructor(private readonly service: MovieService) {
    this.movieRouter = Router()
    this.initializeMovieRoutes()
  }

  private initializeMovieRoutes(): void {
    this.movieRouter.post(
      '/',
      validateResource(MovieValidation.CreateMovieSchema),
      this.createMovie
    )
  }

  private createMovie: RequestHandler = async (
    req: Request<{}, {}, CreateMovieDto>,
    res: Response,
    next: NextFunction
  ) => {
    const movie = await this.movieService.createMovie(req.body)
    res.status(201).json({ success: true, data: movie })
  }
}
