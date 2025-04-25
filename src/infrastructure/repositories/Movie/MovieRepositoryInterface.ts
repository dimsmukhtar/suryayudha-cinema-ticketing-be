import { Movie, Prisma, Cast } from '@prisma/client'
import { MoviePayload } from './entities/MoviePayload'

export interface IMovieRepository {
  createMovie(movieData: MoviePayload, userId: number, movie_genres?: number[]): Promise<Movie>
  getAllMovies(): Promise<Movie[]>
}

export type MovieWithRelations = Prisma.MovieGetPayload<{
  include: {
    created_by: {
      select: {
        id: true
        name: true
      }
    }
    casts: {
      select: {
        id: true
        actor_name: true
        actor_url: true
      }
    }
    movie_genres: {
      select: {
        id: true
        genre: {
          select: {
            name: true
          }
        }
      }
    }
    schedules: true
  }
}>
