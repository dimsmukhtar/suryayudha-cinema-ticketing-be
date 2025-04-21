import { Movie, Prisma, Cast } from '@prisma/client'

export interface IMovieRepository {
  createMovie(
    movieData: Prisma.MovieCreateInput,
    casts?: Omit<Cast, 'id' | 'movie_id' | 'created_at' | 'updated_at'>[],
    movie_genres?: number[]
  ): Promise<Movie>
  getAllMovies(): Promise<Movie[]>
}
