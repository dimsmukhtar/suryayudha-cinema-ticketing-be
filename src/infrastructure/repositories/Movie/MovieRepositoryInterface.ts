import { Movie, Prisma, Cast } from '@prisma/client'

export interface IMovieRepository {
  createMovie(movieData: Prisma.MovieCreateInput, movie_genres?: number[]): Promise<Movie>
  getAllMovies(): Promise<Movie[]>
}

export type MovieWithRelations = Prisma.MovieGetPayload<{
  include: {
    created_by: true
    movie_genres: true
    casts: true
    schedules: true
  }
}>

export type MovieCreateInput = Partial<Prisma.MovieCreateInput>
