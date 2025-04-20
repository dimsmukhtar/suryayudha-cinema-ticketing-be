import express, { Request, Response, NextFunction, RequestHandler, Router } from 'express'
import { MovieService } from './movie.service'
import { CreateMovieDto, MovieValidation } from './movie.validation'
import { validateResource } from '../../../shared/middlewares/validation.middleware'

export class MovieController {
  private readonly movieRouter: Router

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
    this.movieRouter.get('/', this.getAllMovies)
  }

  private createMovie: RequestHandler = async (
    req: Request<{}, {}, CreateMovieDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const movie = await this.service.createMovie(req.body)
      res.status(201).json({ success: true, data: movie })
    } catch (error) {
      next(error)
    }
  }

  private getAllMovies: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const movies = await this.service.getAllMovies()
      res.status(200).json({ success: true, data: movies })
    } catch (error) {
      next(error)
    }
  }

  public getRoutes(): Router {
    return this.movieRouter
  }
}
