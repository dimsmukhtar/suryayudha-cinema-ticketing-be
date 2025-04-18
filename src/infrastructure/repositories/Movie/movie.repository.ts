import {
  Movie,
  Cast,
  Prisma,
  PrismaClient
} from '@/infrastructure/database/generated/prisma/client'
import { prisma } from '@/infrastructure/database/client'

export class MovieRepository {
  private readonly prisma: PrismaClient

  constructor() {
    this.prisma = prisma
  }
  async create(
    movieData: Prisma.MovieCreateInput,
    casts: Omit<Cast, 'id' | 'movie_id' | 'created_at' | 'updated_at'>[],
    genres: number[]
  ): Promise<Movie> {
    return this.prisma.$transaction(async (tx) => {
      const movie = await tx.movie.create({
        data: {
          ...movieData,
          movie_genres: {
            create: genres.map((genre_id) => ({
              genre: { connect: { id: genre_id } }
            }))
          }
        }
      })
      await tx.cast.createMany({
        data: casts.map((cast) => ({
          ...cast,
          movie_id: movie.id
        }))
      })
      return movie
    })
  }
}
