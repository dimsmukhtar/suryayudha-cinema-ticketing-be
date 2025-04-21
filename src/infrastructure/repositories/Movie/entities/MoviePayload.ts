import { Movie, Prisma } from '@prisma/client'

export type MoviePayload = {
  id: number
  title: string
  synopsis: string
  director: string
  duration: string
  rating: string
  language: string
  subtitle: string
  poster_url: string
  trailer_url: string
  release_date: string
  created_by_id: number
  status: 'coming_soon' | 'now_showing' | 'ended'
  movie_genres?: number[]
}

export type MovieResponse = MoviePayload

export function toMovieResponse(movie: MoviePayload): MovieResponse {
  return {
    id: movie.id,
    title: movie.title,
    synopsis: movie.synopsis,
    director: movie.director,
    duration: movie.duration,
    rating: movie.rating,
    language: movie.language,
    subtitle: movie.subtitle,
    poster_url: movie.poster_url,
    trailer_url: movie.trailer_url,
    release_date: movie.release_date,
    created_by_id: movie.created_by_id,
    status: movie.status,
    movie_genres: movie.movie_genres
  }
}
