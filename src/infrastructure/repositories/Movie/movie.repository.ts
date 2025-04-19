import {
  Movie,
  Cast,
  Prisma,
  PrismaClient
} from '@/Infrastructure/database/generated/prisma/client'
import { prisma } from '@/Infrastructure/database/client'
import { ConflictException } from '@/shared/error-handling/exceptions/conflict.exception'
import { NotFoundException } from '@/shared/error-handling/exceptions/not-found.exception'
import { HttpException } from '@/shared/error-handling/exceptions/http.exception'

export class MovieRepository {
  private readonly prisma: PrismaClient = prisma

  async create(
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
        this.handlePrismaError(error)
      }
      throw error
    }
  }

  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Duplicate entry violation')
      case 'P2025':
        throw new NotFoundException('Related resource')
      default:
        throw new HttpException(500, `Database error: ${error.message}`)
    }
  }
}
