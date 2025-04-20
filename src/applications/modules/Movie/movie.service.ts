import { MovieRepository } from '../../../infrastructure/repositories/Movie/movie.repository'
import { CreateMovieDto } from './movie.validation'
import { Movie } from '@prisma/client'
import { CustomHandleError } from '../../../shared/error-handling/exceptions/custom-handle'

export class MovieService {
  constructor(private readonly repository: MovieRepository) {}

  async createMovie(dto: CreateMovieDto): Promise<Movie> {
    try {
      const { casts, genres, ...movieData } = dto
      return await this.repository.CREATE(movieData, casts, genres)
    } catch (error) {
      throw CustomHandleError(error, {
        context: '[MovieService] - Failed to create movie'
      })
    }
  }

  async getAllMovies(): Promise<Movie[]> {
    try {
      return await this.repository.GETALL()
    } catch (error) {
      throw CustomHandleError(error, {
        context: '[MovieService] - Failed to create movie'
      })
    }
  }
}
