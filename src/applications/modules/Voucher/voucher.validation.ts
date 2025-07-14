import { z, ZodType } from 'zod'

export class VoucherValidaton {
  static readonly CREATE: ZodType = z.object({
    code: z
      .string({
        required_error: 'Kode voucher harus diisi',
        invalid_type_error: 'Kode voucher harus berupa string'
      })
      .min(10, 'Kode voucher minimal 10 karakter')
      .toUpperCase(),
    type: z.enum(['percentage', 'fixed'], {
      required_error: 'Tipe voucher harus diisi',
      invalid_type_error: 'Tipe voucher harus berupa string'
    }),
    value: z.number({
      required_error: 'Nilai voucher harus diisi',
      invalid_type_error: 'Nilai voucher harus berupa number'
    }),
    expires_at: z.string({
      required_error: 'Tanggal kadaluarsa harus diisi',
      invalid_type_error: 'Tanggal kadaluarsa harus berupa string'
    }),
    usage_limit: z.number({
      required_error: 'Limit penggunaan harus diisi',
      invalid_type_error: 'Limit penggunaan harus berupa number'
    }),
    usage_count: z.number({
      required_error: 'Jumlah penggunaan harus diisi',
      invalid_type_error: 'Jumlah penggunaan harus berupa number'
    }),
    min_purchase_amount: z.number({
      required_error: 'Minimal pembelian harus diisi',
      invalid_type_error: 'Minimal pembelian harus berupa number'
    })
  })

  static readonly UPDATE: ZodType = z.object({
    code: z
      .string({
        required_error: 'Kode voucher harus diisi',
        invalid_type_error: 'Kode voucher harus berupa string'
      })
      .min(10, 'Kode voucher minimal 10 karakter')
      .toUpperCase()
      .optional(),
    type: z
      .enum(['percentage', 'fixed'], {
        required_error: 'Tipe voucher harus diisi',
        invalid_type_error: 'Tipe voucher harus berupa string'
      })
      .optional(),
    value: z
      .number({
        required_error: 'Nilai voucher harus diisi',
        invalid_type_error: 'Nilai voucher harus berupa number'
      })
      .optional(),
    expires_at: z
      .string({
        required_error: 'Tanggal kadaluarsa harus diisi',
        invalid_type_error: 'Tanggal kadaluarsa harus berupa string'
      })
      .optional(),
    usage_limit: z
      .number({
        required_error: 'Limit penggunaan harus diisi',
        invalid_type_error: 'Limit penggunaan harus berupa number'
      })
      .optional(),
    min_purchase_amount: z
      .number({
        required_error: 'Minimal pembelian harus diisi',
        invalid_type_error: 'Minimal pembelian harus berupa number'
      })
      .optional()
  })
}
