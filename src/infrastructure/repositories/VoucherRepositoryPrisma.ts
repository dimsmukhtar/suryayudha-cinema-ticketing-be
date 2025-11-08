import { PrismaClient, Transaction, Voucher } from '@prisma/client'
import {
  UpdateVoucherPayload,
  VoucherPayload
} from '../../infrastructure/types/entities/VoucherTypes'
import { checkExists } from '../../shared/helpers/checkExistingRow'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { BadRequestException } from '../../shared/error-handling/exceptions/bad-request.exception'

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

  async applyVoucherToTransaction(
    transactionId: number,
    voucherCode: string
  ): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: {
          id: transactionId
        }
      })

      if (!transaction) {
        throw new NotFoundException(`Transaksi dengan id ${transactionId} tidak ditemukan`)
      }

      if (transaction.voucher_id) {
        throw new BadRequestException('Voucher sudah diterapkan pada transaksi ini.')
      }

      if (transaction.status === 'cancelled') {
        throw new BadRequestException('Transaksi ini sudah dibatalkan')
      }

      if (transaction.status === 'settlement') {
        throw new BadRequestException('Transaksi ini sudah selesai')
      }
      const voucher = await tx.voucher.findUnique({
        where: {
          code: voucherCode
        }
      })

      if (!voucher) {
        throw new NotFoundException(`Voucher dengan kode ${voucherCode} tidak ditemukan`)
      }

      if (voucher.expires_at < new Date()) {
        throw new BadRequestException('Voucher sudah kadaluarsa')
      }

      if (voucher.usage_count >= voucher.usage_limit) {
        throw new BadRequestException('Voucher sudah tidak tersedia')
      }

      if (transaction.total_amount < voucher.min_purchase_amount) {
        throw new BadRequestException(
          `Minimum pembelian untuk voucher ini adalah Rp ${voucher.min_purchase_amount}`
        )
      }

      let calculatedDiscountAmount = 0

      if (voucher.type === 'percentage') {
        calculatedDiscountAmount = transaction.total_amount * (voucher.value / 100)
      } else {
        // fixed
        calculatedDiscountAmount = voucher.value
      }

      calculatedDiscountAmount = Math.min(calculatedDiscountAmount, transaction.total_amount)
      const finalAmount = transaction.total_amount - calculatedDiscountAmount

      await tx.voucher.update({
        where: {
          id: voucher.id
        },
        data: {
          usage_count: {
            increment: 1
          }
        }
      })

      const updatedTransaction = await tx.transaction.update({
        where: {
          id: transactionId
        },
        data: {
          voucher_id: voucher.id,
          discount_amount: calculatedDiscountAmount,
          final_amount: finalAmount
        }
      })
      return updatedTransaction
    })
  }
}
