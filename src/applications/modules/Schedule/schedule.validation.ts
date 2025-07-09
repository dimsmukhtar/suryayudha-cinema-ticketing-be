import { z, ZodType } from 'zod'
export class ScheduleValidation {
  static readonly CREATE: ZodType = z.object({
    movie_id: z.number({
      required_error: 'Movie ID harus diisi',
      invalid_type_error: 'Movie ID harus berupa number'
    }),
    studio_id: z.number({
      required_error: 'Studio ID harus diisi',
      invalid_type_error: 'Studio ID harus berupa number'
    }),
    price: z.number({
      required_error: 'Harga harus diisi',
      invalid_type_error: 'Harga harus berupa number'
    }),
    start_time: z.string({
      required_error: 'Waktu mulai harus diisi',
      invalid_type_error: 'Waktu mulai harus berupa string'
    })
  })
}
