import { Movie, Cast, Prisma, PrismaClient } from '@prisma/client'
import { prisma } from '../../../infrastructure/database/client'
import { ConflictException } from '../../../shared/error-handling/exceptions/conflict.exception'
import { MoviePayload, toMovieResponse, MovieResponse } from './entities/MoviePayload'
import { IMovieRepository } from './MovieRepositoryInterface'

export class MovieRepositoryPrisma implements IMovieRepository {
  private readonly prisma: PrismaClient = prisma

  async createMovie(
    movieData: MoviePayload,
    userId: number,
    movie_genres?: number[]
  ): Promise<Movie> {
    const existingMovie = await this.prisma.movie.findFirst({
      where: { title: movieData.title }
    })

    if (existingMovie) {
      throw new ConflictException(`Movie "${movieData.title}" already exists`)
    }
    const movie = await this.prisma.movie.create({
      data: {
        ...movieData,
        created_by_id: userId,
        movie_genres: movie_genres
          ? {
              create: movie_genres.map((genreId) => ({
                genre: {
                  connect: { id: genreId }
                }
              }))
            }
          : undefined
      }
    })
    return movie
  }

  async getAllMovies(): Promise<Movie[]> {
    return await this.prisma.movie.findMany()
  }
}
