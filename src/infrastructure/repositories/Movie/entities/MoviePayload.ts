export enum MovieStatus {
  COMING_SOON = 'coming_soon',
  NOW_SHOWING = 'now_showing',
  ENDED = 'ended'
}

export type MoviePayload = {
  id?: number
  title: string
  synopsis: string
  director: string
  duration: number
  rating: number
  language: string
  subtitle: string
  poster_url: string
  trailer_url: string
  release_date: string
  status: MovieStatus
  movie_genres: number[]
}
