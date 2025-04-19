import { MovieRepository } from '../../../infrastructure/repositories/Movie/movie.repository'
import { CreateMovieDto } from './movie.validation'
import { Movie } from '@prisma/client'
import { HttpException } from '../../..//shared/error-handling/exceptions/http.exception'

export class MovieService {
  private readonly movieRepository: MovieRepository = new MovieRepository()

  async createMovie(dto: CreateMovieDto): Promise<Movie> {
    try {
      const { casts, genres, ...movieData } = dto
      return await this.movieRepository.create(movieData, casts, genres)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(500, 'Failed to create movie')
    }
  }
}
