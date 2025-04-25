import e, { Request, Response, NextFunction, Router } from 'express'
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
    this.movieRouter.get('/:id', this.getMovieById)
  }

  private createMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const moviePayloadRequest: MoviePayload = req.body
      const authReq = req as AuthenticateUser
      const { movie_genres } = req.body
      const movie = await this.service.createMovie(moviePayloadRequest, 1, movie_genres)
      res.status(201).json({ success: true, data: movie })
    } catch (e) {
      next(e)
    }
  }

  private getAllMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movies = await this.service.getAllMovies()
      res.status(200).json({ success: true, data: movies })
    } catch (e) {
      next(e)
    }
  }

  private getMovieById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movie = await this.service.getMovieById(Number(req.params.id))
      res.status(200).json({ success: true, data: movie })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.movieRouter
  }
}
