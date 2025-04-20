import { MovieRepository } from '../../../infrastructure/repositories/Movie/movie.repository'
import { CreateMovieDto } from './movie.validation'
import { Movie } from '@prisma/client'
import { HttpException } from '../../..//shared/error-handling/exceptions/http.exception'

export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  async createMovie(dto: CreateMovieDto): Promise<Movie> {
    try {
      const { casts, genres, ...movieData } = dto
      return await this.movieRepository.CREATE(movieData, casts, genres)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(500, 'Failed to create movie')
    }
  }
}
