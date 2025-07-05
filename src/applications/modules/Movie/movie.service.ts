import { MovieRepositoryPrisma } from '../../../infrastructure/repositories/MovieRepositoryPrisma'
import { Movie } from '@prisma/client'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import {
  MoviePayload,
  MoviePayloadUpdate,
  MovieWithRelations
} from '../../../infrastructure/types/entities/MovieTypes'
import { MovieValidation } from './movie.validation'
import { ZodValidation } from '../../../shared/middlewares/validation.middleware'

export class MovieService {
  constructor(private readonly repository: MovieRepositoryPrisma) {}

  async createMovie(
    movieData: MoviePayload,
    userId: number,
    movie_genres: number[]
  ): Promise<Movie> {
    try {
      const movieCreatePayloadRequest = ZodValidation.validate(MovieValidation.CREATE, movieData)
      return await this.repository.createMovie(movieCreatePayloadRequest, userId, movie_genres)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat film baru'
      })
    }
  }

  async getAllMovies(): Promise<Movie[]> {
    try {
      return await this.repository.getAllMovies()
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil semua film'
      })
    }
  }

  async getMovieById(movieId: number): Promise<MovieWithRelations> {
    try {
      console.log(await this.repository.getMovieById(movieId))
      return await this.repository.getMovieById(movieId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil film berdasarkan id'
      })
    }
  }

  async upateMovie(movieId: number, movieData: MoviePayloadUpdate): Promise<Movie> {
    try {
      const movieUpdatePayloadRequest = ZodValidation.validate(MovieValidation.UPDATE, movieData)
      return await this.repository.updateMovie(movieId, movieUpdatePayloadRequest)
    } catch (e) {
      console.error(e)
      throw CustomHandleError(e, {
        context: 'Error saat mengupdate film'
      })
    }
  }

  async deleteMovie(movieId: number): Promise<void> {
    try {
      await this.repository.deleteMovie(movieId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat menghapus film'
      })
    }
  }
}
