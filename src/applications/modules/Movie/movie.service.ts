import { MovieRepository } from '@/infrastructure/repositories/Movie/movie.repository'
import { CreateMovieDto } from './movie.validation'
import { Movie } from '@/infrastructure/database/generated/prisma/client'

export class MovieService {
  private readonly movieRepository: MovieRepository
  constructor() {
    this.movieRepository = new MovieRepository()
  }

  async createMovie(dto: CreateMovieDto): Promise<Movie> {
    const { casts, genres, ...movieData } = dto
    return this.movieRepository.create(movieData, casts, genres)
  }
}
