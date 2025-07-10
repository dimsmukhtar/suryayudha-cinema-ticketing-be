import { z, ZodType } from 'zod'

export class StudioValidation {
  static readonly CREATE: ZodType = z.object({
    name: z
      .string({
        required_error: 'Studio name harus diisi',
        invalid_type_error: 'Studio name harus berupa string'
      })
      .min(3, 'Studio name minimal 3 karakter'),
    screen_placement: z.enum(['top', 'left', 'right'], {
      required_error: 'Screen placement harus diisi',
      invalid_type_error: 'Screen placement harus berupa string'
    })
  })

  static readonly UPDATE: ZodType = z.object({
    name: z
      .string({
        invalid_type_error: 'Studio name harus berupa string'
      })
      .optional(),
    screen_placement: z
      .enum(['top', 'left', 'right'], {
        required_error: 'Screen placement harus diisi',
        invalid_type_error: 'Screen placement harus berupa string'
      })
      .optional()
  })
}
