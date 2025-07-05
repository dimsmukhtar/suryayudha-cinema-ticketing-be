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
        context: 'Failed to create movie'
      })
    }
  }

  async getAllMovies(): Promise<Movie[]> {
    try {
      return await this.repository.getAllMovies()
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Failed to get all movies'
      })
    }
  }

  async getMovieById(movieId: number): Promise<MovieWithRelations> {
    try {
      return await this.repository.getMovieById(movieId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Failed to get movie by id'
      })
    }
  }

  async upateMovie(movieId: number, movieData: MoviePayloadUpdate): Promise<Movie> {
    try {
      const movieUpdatePayloadRequest = ZodValidation.validate(MovieValidation.UPDATE, movieData)
      return await this.repository.updateMovie(movieId, movieUpdatePayloadRequest)
    } catch (e) {
      console.log(e)
      throw CustomHandleError(e, {
        context: 'Failed to update movie'
      })
    }
  }

  async deleteMovie(movieId: number): Promise<void> {
    try {
      await this.repository.deleteMovie(movieId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Failed to delete movie'
      })
    }
  }
}
