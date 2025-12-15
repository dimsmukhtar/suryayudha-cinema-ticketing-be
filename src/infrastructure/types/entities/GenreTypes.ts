import { Genre, Prisma } from '@prisma/client'

export type GenrePayload = {
  name: string
}
export type GenrePayloadUpdate = Partial<GenrePayload>

export type GenreWithRelations = Prisma.GenreGetPayload<{
  include: {
    movie_genres: {
      select: {
        id: true
        movie: {
          select: {
            id: true
            title: true
          }
        }
      }
    }
  }
}>
export interface IGenreRepository {
  createGenre(genreData: GenrePayload): Promise<Genre>
  updateGenre(genreId: number, genreData: GenrePayloadUpdate): Promise<Genre>
  deleteGenre(genreId: number): Promise<void>
  getGenreById(genreId: number): Promise<Genre>
  getAllGenres(): Promise<Genre[]>
  deleteMovieGenre(movieGenreId: number): Promise<void>
}
