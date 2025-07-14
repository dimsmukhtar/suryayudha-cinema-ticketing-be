import { PrismaClient, Voucher } from '@prisma/client'
import {
  UpdateVoucherPayload,
  VoucherPayload
} from '../../infrastructure/types/entities/VoucherTypes'
import { checkExists } from '../../shared/helpers/checkExistingRow'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'

export class VoucherRepositoryPrisma {
  constructor(private readonly prisma: PrismaClient) {}

  async createVoucher(voucherData: VoucherPayload): Promise<Voucher> {
    return await this.prisma.voucher.create({
      data: {
        ...voucherData,
        expires_at: new Date(voucherData.expires_at)
      }
    })
  }

  async getAllVouchers(): Promise<Voucher[]> {
    return await this.prisma.voucher.findMany()
  }

  async getVoucherById(voucherId: number): Promise<Voucher> {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id: voucherId }
    })
    if (!voucher) {
      throw new NotFoundException(`Voucher dengan id ${voucherId} tidak ditemukan`)
    }
    return voucher
  }

  async updateVoucher(voucherId: number, voucherData: UpdateVoucherPayload): Promise<Voucher> {
    await checkExists(this.prisma.voucher, voucherId, 'Voucher')
    return await this.prisma.voucher.update({
      where: { id: voucherId },
      data: {
        ...voucherData,
        ...(voucherData.expires_at && { expires_at: new Date(voucherData.expires_at) })
      }
    })
  }

  async deleteVoucher(voucherId: number): Promise<void> {
    await checkExists(this.prisma.voucher, voucherId, 'Voucher')
    await this.prisma.voucher.delete({ where: { id: voucherId } })
  }
}
