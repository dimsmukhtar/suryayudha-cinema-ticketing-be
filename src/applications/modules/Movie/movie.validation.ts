import { z, ZodType } from 'zod'

export const MovieCastSchema = z.object({
  actor_name: z.string(),
  actor_url: z.string().url()
})

export class MovieValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string({
      required_error: 'Judul harus diisi',
      invalid_type_error: 'Judul harus berupa string'
    }),
    synopsis: z.string({
      required_error: 'Sinopsis harus diisi',
      invalid_type_error: 'Sinopsis harus berupa string'
    }),
    director: z.string({
      required_error: 'Director harus diisi',
      invalid_type_error: 'Director harus berupa string'
    }),
    duration: z.string({
      required_error: 'Durasi harus diisi',
      invalid_type_error: 'Durasi harus berupa string'
    }),
    rating: z.string({
      required_error: 'Rating harus diisi',
      invalid_type_error: 'Rating harus berupa string'
    }),
    language: z.string({
      required_error: 'Bahasa harus diisi',
      invalid_type_error: 'Bahasa harus berupa string'
    }),
    subtitle: z.string({
      required_error: 'Subtitle harus diisi',
      invalid_type_error: 'Subtitle harus berupa string'
    }),
    poster_url: z.string({
      required_error: 'Poster harus diisi',
      invalid_type_error: 'Poster url harus berupa string'
    }),
    trailer_url: z.string({
      required_error: 'Trailer harus diisi',
      invalid_type_error: 'Trailer url harus berupa string'
    }),
    release_date: z.string({
      required_error: 'Tanggal rilis harus diisi',
      invalid_type_error: 'Tanggal rilis harus berupa string'
    }),
    status: z.enum(['coming_soon', 'now_showing', 'ended'], {
      required_error: 'Status film harus diisi',
      invalid_type_error: 'Status film harus berupa string'
    }),
    casts: z.array(MovieCastSchema).min(1, 'Minimal 1 cast').optional(),
    movie_genres: z.array(z.number().int().positive()).optional()
  })
}
