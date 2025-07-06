import { z, ZodType } from 'zod'

export class CastValidation {
  static readonly CREATE: ZodType = z.object({
    movie_id: z.number({
      required_error: 'Movie ID harus diisi',
      invalid_type_error: 'Movie ID harus berupa number'
    }),
    actor_name: z.string({
      required_error: 'Nama aktor harus diisi',
      invalid_type_error: 'Nama aktor harus berupa string'
    }),
    actor_url: z.unknown({ required_error: 'URL aktor harus diisi' })
  })

  static readonly UPDATE: ZodType = z.object({
    actor_name: z
      .string({
        invalid_type_error: 'Nama aktor harus berupa string'
      })
      .optional(),
    actor_url: z.unknown({ required_error: 'URL aktor harus diisi' }).optional()
  })
}
