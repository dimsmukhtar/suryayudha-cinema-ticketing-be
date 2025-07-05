import { Movie, PrismaClient } from '@prisma/client'
import { ConflictException } from '../../shared/error-handling/exceptions/conflict.exception'
import { MoviePayload, MoviePayloadUpdate } from '../types/entities/MovieTypes'
import { IMovieRepository, MovieWithRelations } from '../types/entities/MovieTypes'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { checkExists } from '../../shared/helpers/checkExistingRow'

export class MovieRepositoryPrisma implements IMovieRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createMovie(movieData: MoviePayload, userId: number, genreIds: number[]): Promise<Movie> {
    return await this.prisma.$transaction(async (tx) => {
      const existingMovie = await tx.movie.findFirst({
        where: {
          title: movieData.title
        }
      })

      if (existingMovie)
        throw new ConflictException(`Movie with title ${movieData.title} already exists`)

      const arrayGenreIds: number[] = Array.isArray(genreIds) ? genreIds : []
      if (arrayGenreIds.length) {
        const count = await tx.genre.count({ where: { id: { in: arrayGenreIds } } })
        if (count !== arrayGenreIds.length) {
          throw new NotFoundException('Some genres not found')
        }
      }
      const movie = await tx.movie.create({
        data: {
          ...movieData,
          release_date: new Date(movieData.release_date),
          created_by_id: userId,
          movie_genres: {
            create: arrayGenreIds.map((gid) => ({
              genre: { connect: { id: gid } }
            }))
          }
        },
        include: {
          movie_genres: { include: { genre: true } }
        }
      })

      return movie
    })
  }

  async getAllMovies(): Promise<Movie[]> {
    return await this.prisma.movie.findMany()
  }

  async getMovieById(movieId: number): Promise<MovieWithRelations> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        created_by: {
          select: {
            id: true,
            name: true
          }
        },
        casts: {
          select: {
            id: true,
            actor_name: true,
            actor_url: true
          }
        },
        movie_genres: {
          select: {
            id: true,
            genre: {
              select: {
                name: true
              }
            }
          }
        },
        schedules: true
      }
    })
    if (!movie) {
      throw new NotFoundException(`Movie with id ${movieId} not found`)
    }
    return movie
  }

  async updateMovie(movieId: number, movieData: MoviePayloadUpdate): Promise<Movie> {
    await checkExists(this.prisma.movie, movieId, 'Movie')
    return await this.prisma.movie.update({
      where: {
        id: movieId
      },
      data: movieData
    })
  }

  async deleteMovie(movieId: number): Promise<void> {
    await checkExists(this.prisma.movie, movieId, 'Movie')
    await this.prisma.movie.delete({
      where: { id: movieId }
    })
  }
}
