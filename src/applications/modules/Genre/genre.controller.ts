import { Request, Response, NextFunction, Router } from 'express'
import { GenreService } from './genre.service'
import { GenrePayload, GenrePayloadUpdate } from '@infrastructure/types/entities/GenreTypes'
import { authenticate } from '@shared/middlewares/authenticate'
import { validateAdmin } from '@shared/middlewares/valiadateAdmin'

export class GenreController {
  private readonly genreRouter: Router
  constructor(private readonly service: GenreService) {
    this.genreRouter = Router()
    this.initializeGenreRoutes()
  }

  private initializeGenreRoutes() {
    this.genreRouter.get('/', this.getAllGenres)
    this.genreRouter.get('/:id', this.getGenreById)
    this.genreRouter.post('/', authenticate, validateAdmin, this.createGenre)
    this.genreRouter.patch('/:id', authenticate, validateAdmin, this.updateGenre)
    this.genreRouter.delete('/:id', authenticate, validateAdmin, this.deleteGenre)
    this.genreRouter.delete('/movie-genre/:id', authenticate, validateAdmin, this.deleteMovieGenre)
    this.genreRouter.post('/movie-genre', authenticate, validateAdmin, this.addGenreToMovie)
  }

  private createGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createGenrePayload: GenrePayload = req.body
      const genre = await this.service.createGenre(createGenrePayload)
      res.status(201).json({ success: true, message: 'Genre berhasil dibuat', data: genre })
    } catch (e) {
      next(e)
    }
  }

  private updateGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateGenrePayload: GenrePayloadUpdate = req.body
      const genre = await this.service.updateGenre(parseInt(req.params.id), updateGenrePayload)
      res.status(200).json({ success: true, message: 'Genre berhasil diupdate', data: genre })
    } catch (e) {
      next(e)
    }
  }

  private deleteGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteGenre(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Genre berhasil dihapus' })
    } catch (e) {
      next(e)
    }
  }

  private getGenreById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genre = await this.service.getGenreById(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Genre berhasil diambil', data: genre })
    } catch (e) {
      next(e)
    }
  }

  private getAllGenres = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genres = await this.service.getAllGenres()
      res.status(200).json({ success: true, message: 'Semua genre berhasil diambil', data: genres })
    } catch (e) {
      next(e)
    }
  }

  private deleteMovieGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteMovieGenre(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Genre film berhasil dihapus' })
    } catch (e) {
      next(e)
    }
  }

  private addGenreToMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genreId = parseInt(req.body.genre_id)
      const movieId = parseInt(req.body.movie_id)
      await this.service.addGenretoMovie(genreId, movieId)
      res.status(200).json({ success: true, message: 'Genre berhasil ditambahkan ke film' })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.genreRouter
  }
}
