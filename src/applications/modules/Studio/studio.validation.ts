import { z, ZodType } from 'zod'

export class StudioValidation {
  static readonly CREATE: ZodType = z.object({
    name: z
      .string({
        required_error: 'Studio name harus diisi',
        invalid_type_error: 'Studio name harus berupa string'
      })
      .min(3, 'Studio name minimal 3 karakter')
  })

  static readonly UPDATE: ZodType = z.object({
    name: z
      .string({
        invalid_type_error: 'Studio name harus berupa string'
      })
      .optional()
  })
}
