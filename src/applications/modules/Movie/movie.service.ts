import { MovieRepositoryPrisma } from '../../../infrastructure/repositories/Movie/MovieRepositoryPrisma'
import { CreateMovieDto } from './movie.validation'
import { Movie } from '@prisma/client'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'

export class MovieService {
  constructor(private readonly repository: MovieRepositoryPrisma) {}

  async createMovie(dto: CreateMovieDto): Promise<Movie> {
    try {
      const { casts, movie_genres, ...movieData } = dto
      return await this.repository.createMovie(movieData, casts, movie_genres)
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
