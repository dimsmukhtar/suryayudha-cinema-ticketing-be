import { MovieRepositoryPrisma } from '../../../infrastructure/repositories/Movie/MovieRepositoryPrisma'
import { Movie } from '@prisma/client'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import { MoviePayload } from '../../../infrastructure/repositories/Movie/entities/MoviePayload'

export class MovieService {
  constructor(private readonly repository: MovieRepositoryPrisma) {}

  async createMovie(movieData: MoviePayload, userId: number): Promise<Movie> {
    try {
      const createRequest = 
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
