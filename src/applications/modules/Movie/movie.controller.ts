import e, { Request, Response, NextFunction, Router } from 'express'
import { MovieService } from './movie.service'
import { AuthenticateUser } from '../../../shared/definitions/AuthenticateUser'
import { MoviePayload, MoviePayloadUpdate } from '../../../infrastructure/types/entities/MovieTypes'
import { upload } from '../../../shared/utils/multer.config'
import { uploadImageToImageKit } from '../../../shared/utils/imagekit.config'
import { devNull } from 'os'

export class MovieController {
  private readonly movieRouter: Router

  constructor(private readonly service: MovieService) {
    this.movieRouter = Router()
    this.initializeMovieRoutes()
  }

  private initializeMovieRoutes(): void {
    this.movieRouter.post('/', upload.single('poster_url'), this.createMovie)
    this.movieRouter.get('/', this.getAllMovies)
    this.movieRouter.get('/:id', this.getMovieById)
    this.movieRouter.patch('/:id', this.updateMovie)
    this.movieRouter.delete('/:id', this.deleteMovie)
  }

  private createMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file
      let posterUrl = null
      if (file) {
        posterUrl = await uploadImageToImageKit(file)
      }

      const movieCreatePayloadRequest: MoviePayload = {
        ...req.body,
        poster_url: posterUrl
      }
      const authReq = req as AuthenticateUser
      const genreIds = req.body.movie_genres
        .split(',')
        .map((id: string) => parseInt(id.trim()))
        .filter((id: number) => !isNaN(id))
      const movie = await this.service.createMovie(movieCreatePayloadRequest, 1, genreIds)
      res.status(201).json({ success: true, message: 'Film berhasil dibuat', data: movie })
    } catch (e) {
      next(e)
    }
  }

  private getAllMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movies = await this.service.getAllMovies()
      res.status(200).json({ success: true, message: 'Semua film berhasil diambil', data: movies })
    } catch (e) {
      next(e)
    }
  }

  private getMovieById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movie = await this.service.getMovieById(Number(req.params.id))
      res.status(200).json({ success: true, message: 'Film berhasil diambil', data: movie })
    } catch (e) {
      next(e)
    }
  }

  private updateMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movieUpdatePayloadRequest: MoviePayloadUpdate = req.body
      const movie = await this.service.upateMovie(Number(req.params.id), movieUpdatePayloadRequest)
      res.status(200).json({ success: true, message: 'Film berhasil diupdate', data: movie })
    } catch (e) {
      next(e)
    }
  }

  private deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteMovie(Number(req.params.id))
      res.status(200).json({
        success: true,
        message: 'Film berhasil dihapus'
      })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.movieRouter
  }
}
