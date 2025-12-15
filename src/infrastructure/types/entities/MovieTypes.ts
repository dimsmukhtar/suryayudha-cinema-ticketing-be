import { Movie, Prisma } from '@prisma/client'

export type MoviePayload = {
  title: string
  synopsis: string
  director: string
  duration: string
  rating: string
  language: string
  subtitle: string
  poster_url: Express.Multer.File
  trailer_url: string
  release_date: string
  status: 'coming_soon' | 'now_showing' | 'ended'
}

export type MovieQuery = {
  title?: string
  status?: string
  genre?: string
}

export type MoviePayloadUpdate = Partial<MoviePayload>

export type MovieResponse = MoviePayload

// export type MovieWithRelations = Prisma.MovieGetPayload<{
//   include: {
//     created_by: {
//       select: {
//         id: true
//         name: true
//       }
//     }
//     casts: {
//       select: {
//         id: true
//         actor_name: true
//         actor_url: true
//       }
//     }
//     movie_genres: {
//       select: {
//         id: true
//         genre: {
//           select: {
//             id: true
//             name: true
//           }
//         }
//       }
//     }
//     schedules: true
//   }
// }>

export interface IMovieRepository {
  createMovie(movieData: MoviePayload, userId: number, movie_genres?: number[]): Promise<Movie>
  getAllMovies(
    page: number,
    limit: number,
    query: MovieQuery
  ): Promise<{ movies: Movie[]; total: number }>
  updateMovie(movieId: number, movieData: MoviePayloadUpdate): Promise<Movie>
  deleteMovie(movieId: number): Promise<void>
}
