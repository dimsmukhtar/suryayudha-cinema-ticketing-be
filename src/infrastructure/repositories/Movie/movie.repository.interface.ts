import { Movie, Prisma, Cast } from '@prisma/client'

export interface IMovieRepository {
  CREATE(
    movieData: Prisma.MovieCreateInput,
    casts: Omit<Cast, 'id' | 'movie_id' | 'created_at' | 'updated_at'>[],
    genres: number[]
  ): Promise<Movie>
  GETALL(): Promise<Movie[]>
}
