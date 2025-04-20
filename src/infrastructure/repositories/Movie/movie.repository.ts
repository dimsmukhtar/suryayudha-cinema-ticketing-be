import { Movie, Cast, Prisma, PrismaClient } from '@prisma/client'
import { prisma } from '../../../infrastructure/database/client'
import { ConflictException } from '../../../shared/error-handling/exceptions/conflict.exception'
import { NotFoundException } from '../../../shared/error-handling/exceptions/not-found.exception'
import { handlePrismaError } from '../../../shared/error-handling/exceptions/prisma.error'
import { IMovieRepository } from './movie.repository.interface'
import { logger } from '../../../shared/utils/logger'

export class MovieRepository implements IMovieRepository {
  private readonly prisma: PrismaClient = prisma

  async CREATE(
    movieData: Prisma.MovieCreateInput,
    casts: Omit<Cast, 'id' | 'movie_id' | 'created_at' | 'updated_at'>[],
    genres: number[]
  ): Promise<Movie> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const existingMovie = await tx.movie.findFirst({
          where: { title: movieData.title }
        })

        if (existingMovie) {
          throw new ConflictException(`Movie "${movieData.title}" already exists`)
        }
        const movie = await tx.movie.create({
          data: {
            ...movieData,
            movie_genres: {
              create: await Promise.all(
                genres.map(async (genreId) => {
                  const genreExists = await tx.genre.findUnique({
                    where: { id: genreId }
                  })
                  if (!genreExists) {
                    throw new NotFoundException('Genre', genreId)
                  }
                  return { genre: { connect: { id: genreId } } }
                })
              )
            }
          }
        })

        if (casts.length > 0) {
          await tx.cast.createMany({
            data: casts.map((cast) => ({
              ...cast,
              movie_id: movie.id
            }))
          })
        }

        return movie
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      logger.error('Unexpected error in movie repository', error)
      throw error
    }
  }

  async GETALL(): Promise<Movie[]> {
    return await this.prisma.movie.findMany()
  }
}
