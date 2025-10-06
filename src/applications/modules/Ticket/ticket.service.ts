import { Ticket } from '@prisma/client'
import { TicketRepositoryPrisma } from '../../../infrastructure/repositories/TicketRepositoryPrisma'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import { BadRequestException } from '../../../shared/error-handling/exceptions/bad-request.exception'

export class TicketService {
  constructor(private readonly repository: TicketRepositoryPrisma) {}

  async getAllTickets(filter: { code?: string }) {
    try {
      return await this.repository.getAllTickets(filter)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil semua tiket'
      })
    }
  }

  async getTicketById(ticketId: number): Promise<Ticket> {
    try {
      return await this.repository.getTicketById(ticketId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil tiket berdasarkan id'
      })
    }
  }
  async getTicketByCode(code: string): Promise<Ticket> {
    try {
      if (!code) {
        throw new BadRequestException('Tiket code tidak boleh kosong')
      }
      return await this.repository.getTicketByCode(code)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil tiket berdasarkan kode'
      })
    }
  }

  async deleteTicket(ticketId: number): Promise<void> {
    try {
      await this.repository.deleteTicket(ticketId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat menghapus tiket'
      })
    }
  }

  async getMyTickets(userId: number): Promise<any> {
    try {
      return await this.repository.getMyTickets(userId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil tiket saya'
      })
    }
  }

  async validateTicket(code: string): Promise<Ticket> {
    try {
      if (!code) {
        throw new BadRequestException('Tiket code tidak boleh kosong')
      }
      return await this.repository.validateTicket(code)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat validasi tiket'
      })
    }
  }
}
