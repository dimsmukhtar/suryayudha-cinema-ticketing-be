import { ScheduleRepositoryPrisma } from '../../../infrastructure/repositories/ScheduleRepositoryPrisma'
import { SchedulePayload } from '../../../infrastructure/types/entities/ScheduleTypes'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'

export class ScheduleService {
  constructor(private readonly repository: ScheduleRepositoryPrisma) {}

  async createSchedule(scheduleData: SchedulePayload, userId: number) {
    try {
      return await this.repository.createSchedule(scheduleData, userId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat jadwal baru'
      })
    }
  }
}
