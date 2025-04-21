import { Movie, Prisma, Cast } from '@prisma/client'
import { MoviePayload } from './entities/MoviePayload'

export interface IMovieRepository {
  createMovie(movieData: MoviePayload, userId: number, movie_genres?: number[]): Promise<Movie>
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
