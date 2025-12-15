import {
  GenrePayload,
  GenrePayloadUpdate,
  GenreWithRelations
} from '@infrastructure/types/entities/GenreTypes'
import { GenreRepositoryPrisma } from '@infrastructure/repositories/GenreRepositoryPrisma'
import { Genre } from '@prisma/client'
import { CustomHandleError } from '@shared/error-handling/middleware/custom-handle'

export class GenreService {
  constructor(private readonly repository: GenreRepositoryPrisma) {}

  async createGenre(genreData: GenrePayload): Promise<Genre> {
    try {
      return await this.repository.createGenre(genreData)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat genre'
      })
    }
  }

  async updateGenre(genreId: number, genreData: GenrePayloadUpdate): Promise<Genre> {
    try {
      return await this.repository.updateGenre(genreId, genreData)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengupdate genre'
      })
    }
  }

  async deleteGenre(genreId: number): Promise<void> {
    try {
      await this.repository.deleteGenre(genreId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat menghapus genre'
      })
    }
  }

  async getGenreById(genreId: number): Promise<GenreWithRelations> {
    try {
      return await this.repository.getGenreById(genreId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil genre berdasarkan id'
      })
    }
  }

  async getAllGenres(): Promise<Genre[]> {
    try {
      return await this.repository.getAllGenres()
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil semua genre'
      })
    }
  }

  async deleteMovieGenre(movieGenreId: number): Promise<void> {
    try {
      await this.repository.deleteMovieGenre(movieGenreId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat menghapus genre film'
      })
    }
  }

  async addGenretoMovie(genreId: number, movieId: number): Promise<void> {
    try {
      await this.repository.addGenretoMovie(genreId, movieId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat menambah genre ke film'
      })
    }
  }
}
