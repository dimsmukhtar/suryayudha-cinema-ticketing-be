import express, { Request, Response, NextFunction, RequestHandler } from 'express'
import { MovieService } from './movie.service'
import { CreateMovieDto, MovieValidation } from './movie.validation'

export class MovieController {
  private readonly movieService: MovieService

  constructor() {
    this.movieService = new MovieService()
  }

  createMovie: RequestHandler = async (
    req: Request<{}, {}, CreateMovieDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const movie = await this.movieService.createMovie(req.body)
      res.status(201).json({ success: true, movie })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}
