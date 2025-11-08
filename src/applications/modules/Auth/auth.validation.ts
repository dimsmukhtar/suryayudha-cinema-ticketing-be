import { email } from 'envalid'
import { ZodType, z } from 'zod'

export class AuthValidation {
  static readonly REGISTER: ZodType = z
    .object({
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
      passwordConfirmation: z.string({
        required_error: 'Konfirmasi password harus diisi',
        invalid_type_error: 'Konfirmasi password harus berupa string'
      }),
      role: z.enum(['user', 'admin'], {
        required_error: 'Role harus diisi',
        invalid_type_error: 'Role harus berupa string'
      }),
      profile_url: z.unknown({
        invalid_type_error: 'URL profile harus diisi'
      }),
      is_verified: z.boolean({
        required_error: 'Status verifikasi harus diisi',
        invalid_type_error: 'Status verifikasi harus berupa boolean'
      }),
      verification_token: z.string({
        required_error: 'Token verifikasi harus diisi',
        invalid_type_error: 'Token verifikasi harus berupa string'
      }),
      verification_token_expires_at: z.date({
        required_error: 'Tanggal kadaluarsa token verifikasi harus diisi',
        invalid_type_error: 'Tanggal kadaluarsa token verifikasi harus berupa date'
      })
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Password dan konfirmasi password tidak cocok',
      path: ['passwordConfirmation']
    })

  static readonly LOGIN: ZodType = z.object({
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
      .min(8, 'Password minimal 8 karakter')
  })

  static readonly UPDATE_PROFILE: ZodType = z.object({
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
    profile_url: z
      .unknown({
        invalid_type_error: 'URL profile harus diisi'
      })
      .optional()
  })

  static readonly CHANGE_PASSWORD: ZodType = z
    .object({
      oldPassword: z
        .string({
          required_error: 'Password lama harus diisi',
          invalid_type_error: 'Password lama harus berupa string'
        })
        .min(8, 'Password lama minimal 8 karakter'),
      newPassword: z
        .string({
          required_error: 'Password baru harus diisi',
          invalid_type_error: 'Password baru harus berupa string'
        })
        .min(8, 'Password baru minimal 8 karakter'),
      newPasswordConfirmation: z.string({
        required_error: 'Konfirmasi password baru harus diisi',
        invalid_type_error: 'Konfirmasi password baru harus berupa string'
      })
    })
    .refine((data) => data.newPassword === data.newPasswordConfirmation, {
      message: 'Password baru dan konfirmasi password baru tidak cocok',
      path: ['newPasswordConfirmation']
    })

  static readonly FORGOT_PASSWORD: ZodType = z.object({
    email: z
      .string({
        required_error: 'Email harus diisi',
        invalid_type_error: 'Email harus berupa string'
      })
      .email('Email tidak valid')
  })

  static readonly RESET_PASSWORD: ZodType = z
    .object({
      email: z
        .string({
          required_error: 'Email harus diisi',
          invalid_type_error: 'Email harus berupa string'
        })
        .email('Email tidak valid'),
      passwordResetCode: z.string({
        required_error: 'Kode reset password harus diisi',
        invalid_type_error: 'Kode reset password harus berupa string'
      }),
      newPassword: z
        .string({
          required_error: 'Password baru harus diisi',
          invalid_type_error: 'Password baru harus berupa string'
        })
        .min(8, 'Password baru minimal 8 karakter'),
      newPasswordConfirmation: z.string({
        required_error: 'Konfirmasi password baru harus diisi',
        invalid_type_error: 'Konfirmasi password baru harus berupa string'
      })
    })
    .refine((data) => data.newPassword === data.newPasswordConfirmation, {
      message: 'Password baru dan konfirmasi password baru tidak cocok',
      path: ['newPasswordConfirmation']
    })
}
