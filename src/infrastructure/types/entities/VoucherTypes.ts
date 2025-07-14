import { VoucherType } from '@prisma/client'

export type VoucherPayload = {
  code: string
  type: VoucherType
  value: number
  expires_at: string
  usage_limit: number
  usage_count: number
  min_purchase_amount: number
}

export type UpdateVoucherPayload = Partial<VoucherPayload>
