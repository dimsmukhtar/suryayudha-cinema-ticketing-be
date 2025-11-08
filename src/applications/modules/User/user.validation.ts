import { ZodType, z } from 'zod'

export class UserValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string({
      required_error: 'Nama harus diisi',
      invalid_type_error: 'Nama harus berupa string'
    }),
    email: z
      .string({
        required_error: 'Email harus diisi',
        invalid_type_error: 'Email harus berupa string'
      })
      .email('Email tidak valid'),
    password: z
      .string({
        required_error: 'Password harus diisi',
        invalid_type_error: 'Password harus berupa string'
      })
      .min(8, 'Password minimal 8 karakter'),
    role: z.enum(['user', 'admin'], {
      required_error: 'Role harus diisi',
      invalid_type_error: 'Role harus berupa string'
    }),
    profile_url: z
      .unknown({
        invalid_type_error: 'URL profile harus diisi'
      })
      .optional(),
    is_verified: z.boolean({
      required_error: 'Status verifikasi harus diisi',
      invalid_type_error: 'Status verifikasi harus berupa boolean'
    })
  })

  static readonly UPDATE: ZodType = z.object({
    name: z
      .string({
        invalid_type_error: 'Nama harus berupa string'
      })
      .optional(),
    email: z
      .string({
        invalid_type_error: 'Email harus berupa string'
      })
      .email('Email tidak valid')
      .optional(),
    password: z
      .string({
        invalid_type_error: 'Password harus berupa string'
      })
      .min(8, 'Password minimal 8 karakter')
      .optional(),
    role: z
      .enum(['user', 'admin'], {
        invalid_type_error: 'Role harus berupa string'
      })
      .optional(),
    profile_url: z
      .unknown({
        invalid_type_error: 'URL profile harus diisi'
      })
      .optional(),
    is_verified: z
      .boolean({
        invalid_type_error: 'Status verifikasi harus berupa boolean'
      })
      .optional()
  })
}
