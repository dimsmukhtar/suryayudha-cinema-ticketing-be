import { PrismaClient, Genre } from '@prisma/client'
import {
  IGenreRepository,
  GenrePayload,
  GenrePayloadUpdate,
  GenreWithRelations
} from '@infrastructure/types/entities/GenreTypes'
import { checkExists } from '@shared/helpers/checkExistingRow'
import { NotFoundException } from '@shared/error-handling/exceptions/not-found.exception'

export class GenreRepositoryPrisma implements IGenreRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async createGenre(genreData: GenrePayload): Promise<Genre> {
    return await this.prisma.genre.create({
      data: genreData
    })
  }
  async updateGenre(genreId: number, genreData: GenrePayloadUpdate): Promise<Genre> {
    await checkExists(this.prisma.genre, genreId, 'Genre')
    return await this.prisma.genre.update({
      where: {
        id: genreId
      },
      data: genreData
    })
  }
  async deleteGenre(genreId: number): Promise<void> {
    await checkExists(this.prisma.genre, genreId, 'Genre')
    await this.prisma.genre.delete({
      where: { id: genreId }
    })
  }
  async getGenreById(genreId: number): Promise<GenreWithRelations> {
    const genre = await this.prisma.genre.findUnique({
      where: { id: genreId },
      include: {
        movie_genres: {
          select: {
            id: true,
            movie: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    })
    if (!genre) {
      throw new NotFoundException(`Genre dengan id ${genreId} tidak ditemukan`)
    }
    return genre
  }
  async getAllGenres(): Promise<Genre[]> {
    return await this.prisma.genre.findMany()
  }

  async deleteMovieGenre(movieGenreId: number): Promise<void> {
    await checkExists(this.prisma.movieGenre, movieGenreId, 'Genre Film')
    await this.prisma.movieGenre.delete({
      where: { id: movieGenreId }
    })
  }

  async addGenretoMovie(genreId: number, movieId: number): Promise<void> {
    await checkExists(this.prisma.genre, genreId, 'Genre')
    await checkExists(this.prisma.movie, movieId, 'Film')
    await this.prisma.movieGenre.create({
      data: {
        genre_id: genreId,
        movie_id: movieId
      }
    })
  }
}
