import { Request, Response, NextFunction, Router } from 'express'
import { MovieService } from './movie.service'
import { AuthenticateUser } from '../../../shared/definitions/AuthenticateUser'
import { MoviePayload } from '../../../infrastructure/repositories/Movie/entities/MoviePayload'

export class MovieController {
  private readonly movieRouter: Router

  constructor(private readonly service: MovieService) {
    this.movieRouter = Router()
    this.initializeMovieRoutes()
  }

  private initializeMovieRoutes(): void {
    this.movieRouter.post(
      '/',
      // validateResource(MovieValidation.CreateMovieSchema),
      this.createMovie
    )
    this.movieRouter.get('/', this.getAllMovies)
  }

  private createMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const moviePayloadRequest: MoviePayload = req.body
      const authReq = req as AuthenticateUser
      const { movies_genres } = req.body
      const movie = await this.service.createMovie(
        moviePayloadRequest,
        authReq.user.id,
        movies_genres
      )
      res.status(201).json({ success: true, data: movie })
    } catch (error) {
      next(error)
    }
  }

  private getAllMovies = async (req: Request, res: Response, next: NextFunction) => {
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
