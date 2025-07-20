import { Transaction } from '@prisma/client'
import { TransactionRepositoryPrisma } from '../../../infrastructure/repositories/TransactionRepositoryPrisma'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import { BadRequestException } from '../../../shared/error-handling/exceptions/bad-request.exception'
import { snap } from '../../../shared/utils/midtrans'
import {
  queryGetAllTransactions,
  queryGetMyTransactions
} from '../../../infrastructure\/types/entities/TransactionTypes'

export class TransactionService {
  constructor(private readonly repository: TransactionRepositoryPrisma) {}

  async createBooking(
    scheduleId: number,
    userId: number,
    scheduleSeatIds: number[]
  ): Promise<Transaction> {
    try {
      if (!scheduleId) {
        throw new BadRequestException('Schedule ID tidak boleh kosong')
      }
      return await this.repository.createBooking(scheduleId, userId, scheduleSeatIds)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat booking'
      })
    }
  }

  async getAllTransactions(query: queryGetAllTransactions): Promise<Transaction[]> {
    try {
      return await this.repository.getAllTransactions(query)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil semua transaksi'
      })
    }
  }

  async getAllBookings(): Promise<Transaction[]> {
    try {
      return await this.repository.getAllBookings()
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil semua booking'
      })
    }
  }

  async getTransactionById(transactionId: number): Promise<Transaction> {
    try {
      return await this.repository.getTransactionById(transactionId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil transaksi berdasarkan id'
      })
    }
  }

  async getMyTransactions(userId: number, query: queryGetMyTransactions): Promise<Transaction[]> {
    try {
      return await this.repository.getMyTransactions(userId, query)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil transaksi berdasarkan user id'
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

  async initiatePayment(transactionId: number, userId: number) {
    try {
      return await this.repository.initiatePayment(transactionId, userId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat proses melakukan pembayaran'
      })
    }
  }

  async checkMidtransStatus(orderId: string) {
    try {
      const midtransStatusResponse = await snap.transaction.status(orderId)
      return midtransStatusResponse
    } catch (error: any) {
      console.error('Error received while checking Midtrans status:', error.message)

      try {
        const midtransError = JSON.parse(error.message)
        const errorMessage = midtransError.error_messages
          ? midtransError.error_messages.join(', ')
          : 'Unknown Midtrans error'

        throw new BadRequestException(`Midtrans API Error: ${errorMessage}`)
      } catch (parseError) {
        throw new BadRequestException(`Midtrans API Error: ${error.message}`)
      }
    }
  }
}
