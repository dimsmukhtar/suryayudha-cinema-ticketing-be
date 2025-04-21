import { Movie, Cast, Prisma, PrismaClient } from '@prisma/client'
import { prisma } from '../../../infrastructure/database/client'
import { ConflictException } from '../../../shared/error-handling/exceptions/conflict.exception'
import { NotFoundException } from '../../../shared/error-handling/exceptions/not-found.exception'
import { IMovieRepository } from './MovieRepositoryInterface'

export class MovieRepositoryPrisma implements IMovieRepository {
  private readonly prisma: PrismaClient = prisma

  async createMovie(
    movieData: Prisma.MovieCreateInput,
    casts?: Omit<Cast, 'id' | 'movie_id' | 'created_at' | 'updated_at'>[],
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
        movie_genres: movie_genres
          ? {
              create: await Promise.all(
                movie_genres.map(async (genreId) => {
                  const genreExists = await this.prisma.movieGenre.findUnique({
                    where: { id: genreId }
                  })
                  if (!genreExists) {
                    throw new NotFoundException('Genre', genreId)
                  }
                  return { genre: { connect: { id: genreId } } }
                })
              )
            }
          : undefined
      }
    })

    if (casts && casts.length > 0) {
      await this.prisma.cast.createMany({
        data: casts.map((cast) => ({
          ...cast,
          movie_id: movie.id
        }))
      })
    }

    return movie
  }

  async getAllMovies(): Promise<Movie[]> {
    return await this.prisma.movie.findMany()
  }
}
