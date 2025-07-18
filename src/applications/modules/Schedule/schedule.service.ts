import { Schedule, ScheduleSeat, SeatStatus } from '@prisma/client'
import { ScheduleRepositoryPrisma } from '../../../infrastructure/repositories/ScheduleRepositoryPrisma'
import {
  SchedulePayload,
  ScheduleQuery,
  ScheduleWithScheduleSeats
} from '../../../infrastructure/types/entities/ScheduleTypes'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import { ScheduleValidation } from './schedule.validation'
import { ZodValidation } from '../../../shared/middlewares/validation.middleware'
import { BadRequestException } from '../../../shared/error-handling/exceptions/bad-request.exception'

export class ScheduleService {
  constructor(private readonly repository: ScheduleRepositoryPrisma) {}

  async createSchedule(scheduleData: SchedulePayload, userId: number) {
    try {
      const schedulePayloadRequest = ZodValidation.validate(ScheduleValidation.CREATE, scheduleData)
      return await this.repository.createSchedule(schedulePayloadRequest, userId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat jadwal baru'
      })
    }
  }

  async getAllSchedules(query: ScheduleQuery): Promise<Schedule[]> {
    try {
      return await this.repository.getAllSchedules(query)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil semua data schedule'
      })
    }
  }

  async getScheduleById(scheduleId: number): Promise<Schedule> {
    try {
      return await this.repository.getScheduleById(scheduleId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil schedule berdasarkan id'
      })
    }
  }

  async deleteSchedule(scheduleId: number): Promise<void> {
    try {
      await this.repository.deleteSchedule(scheduleId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat menghapus schedule'
      })
    }
  }

  async getScheduleLayout(scheduleId: number) {
    try {
      return await this.repository.getScheduleLayout(scheduleId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil layout jadwal'
      })
    }
  }

  async updateScheduleSeatStatus(scheduleSeatId: number, status: string): Promise<ScheduleSeat> {
    try {
      const validSeatStatus: SeatStatus[] = [
        SeatStatus.booked,
        SeatStatus.reserved,
        SeatStatus.available
      ]
      if (!validSeatStatus.includes(status as SeatStatus)) {
        throw new BadRequestException('Invalid seat status')
      }
      return await this.repository.updateScheduleSeatStatus(scheduleSeatId, status)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengupdate schedule seat status'
      })
    }
  }
}
