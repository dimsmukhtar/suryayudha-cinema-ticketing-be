import { MovieRepositoryPrisma } from '../../../infrastructure/repositories/Movie/MovieRepositoryPrisma'
import { Movie } from '@prisma/client'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import { MoviePayload } from '../../../infrastructure/repositories/Movie/entities/MoviePayload'
import { MovieValidation } from './movie.validation'
import { ZodValidation } from '../../../shared/middlewares/validation.middleware'

export class MovieService {
  constructor(private readonly repository: MovieRepositoryPrisma) {}

  async createMovie(
    movieData: MoviePayload,
    userId: number,
    movie_genres?: number[]
  ): Promise<Movie> {
    try {
      const createRequest = ZodValidation.validate(MovieValidation.CREATE, movieData)
      return await this.repository.createMovie(createRequest, userId, movie_genres)
    } catch (error) {
      throw CustomHandleError(error, {
        context: '[MovieService] - Failed to create movie'
      })
    }
  }

  async getAllMovies(): Promise<Movie[]> {
    try {
      return await this.repository.getAllMovies()
    } catch (error) {
      throw CustomHandleError(error, {
        context: '[MovieService] - Failed to get all movies'
      })
    }
  }
}
