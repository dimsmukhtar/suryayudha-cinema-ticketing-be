import { Transaction, Voucher } from '@prisma/client'
import { UpdateVoucherPayload, VoucherPayload } from '@infrastructure/types/entities/VoucherTypes'
import { VoucherRepositoryPrisma } from '@infrastructure/repositories/VoucherRepositoryPrisma'
import { CustomHandleError } from '@shared/error-handling/middleware/custom-handle'
import { ZodValidation } from '@shared/middlewares/validation.middleware'
import { VoucherValidaton } from './voucher.validation'
import { BadRequestException } from '@shared/error-handling/exceptions/bad-request.exception'

export class VoucherService {
  constructor(private readonly repository: VoucherRepositoryPrisma) {}

  async createVoucher(voucherData: VoucherPayload): Promise<Voucher> {
    try {
      const createVoucherPayloadRequest = ZodValidation.validate(
        VoucherValidaton.CREATE,
        voucherData
      )
      return await this.repository.createVoucher(createVoucherPayloadRequest)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat voucher'
      })
    }
  }

  async getAllVouchers(): Promise<Voucher[]> {
    try {
      return await this.repository.getAllVouchers()
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil semua voucher'
      })
    }
  }

  async getVoucherById(voucherId: number): Promise<Voucher> {
    try {
      return await this.repository.getVoucherById(voucherId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil voucher berdasarkan id'
      })
    }
  }

  async updateVoucher(voucherId: number, voucherData: UpdateVoucherPayload): Promise<Voucher> {
    try {
      const voucherUpdatePayloadRequest = ZodValidation.validate(
        VoucherValidaton.UPDATE,
        voucherData
      )
      return await this.repository.updateVoucher(voucherId, voucherUpdatePayloadRequest)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengupdate voucher'
      })
    }
  }

  async deleteVoucher(voucherId: number): Promise<void> {
    try {
      await this.repository.deleteVoucher(voucherId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat menghapus voucher'
      })
    }
  }

  async applyVoucherToTransaction(
    transactionId: number,
    voucherCode: string
  ): Promise<Transaction> {
    try {
      if (!transactionId) {
        throw new BadRequestException('Transaction ID tidak boleh kosong')
      }
      if (!voucherCode) {
        throw new BadRequestException('Voucher code tidak boleh kosong')
      }
      return await this.repository.applyVoucherToTransaction(transactionId, voucherCode)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat menerapkan voucher ke transaksi'
      })
    }
  }
}
