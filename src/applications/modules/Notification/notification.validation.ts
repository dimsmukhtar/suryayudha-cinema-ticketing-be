import { z, ZodType } from 'zod'
export class NotificationValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string({
      required_error: 'Judul harus diisi',
      invalid_type_error: 'Judul harus berupa string'
    }),
    description: z.string({
      required_error: 'Deskripsi harus diisi',
      invalid_type_error: 'Deskripsi harus berupa string'
    }),
    target_audience: z.enum(['all', 'spesific'], {
      required_error: 'Audience harus diisi',
      invalid_type_error: 'Audience harus berupa string'
    }),
    user_id: z
      .number({
        required_error: 'User ID harus diisi',
        invalid_type_error: 'User ID harus berupa number'
      })
      .optional()
  })
}
