import { Movie, PrismaClient } from '@prisma/client'
import { ConflictException } from '../../../shared/error-handling/exceptions/conflict.exception'
import { MoviePayload, toMovieResponse, MovieResponse } from './entities/MoviePayload'
import { IMovieRepository } from './MovieRepositoryInterface'
import { NotFoundException } from '../../../shared/error-handling/exceptions/not-found.exception'

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
    return await this.prisma.movie.findMany({
      include: {
        created_by: true,
        movie_genres: true
      }
    })
  }
}
