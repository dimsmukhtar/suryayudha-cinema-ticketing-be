import { Movie, Cast, Prisma, PrismaClient } from '@prisma/client'
import { prisma } from '../../../infrastructure/database/client'
import { ConflictException } from '../../../shared/error-handling/exceptions/conflict.exception'
import { NotFoundException } from '../../../shared/error-handling/exceptions/not-found.exception'
import { IMovieRepository } from './MovieRepositoryInterface'

export class MovieRepositoryPrisma implements IMovieRepository {
  private readonly prisma: PrismaClient = prisma

  async createMovie(movieData: Prisma.MovieCreateInput, movie_genres?: number[]): Promise<Movie> {
    const existingMovie = await this.prisma.movie.findFirst({
      where: { title: movieData.title }
    })

    if (existingMovie) {
      throw new ConflictException(`Movie "${movieData.title}" already exists`)
    }
    return this.prisma.movie.create({
      data: {
        ...movieData
      }
    })
  }

  async getAllMovies(): Promise<Movie[]> {
    return await this.prisma.movie.findMany()
  }
}
