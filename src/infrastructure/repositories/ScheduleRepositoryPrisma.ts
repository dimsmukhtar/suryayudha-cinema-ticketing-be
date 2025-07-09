import { PrismaClient, Schedule, SeatStatus } from '@prisma/client'
import { SchedulePayload } from '../../infrastructure/types/entities/ScheduleTypes'
import { parseDurationToMinutes } from '../../shared/helpers/parseDuration'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { checkExists } from '../../shared/helpers/checkExistingRow'
import { BadRequestException } from '../../shared/error-handling/exceptions/bad-request.exception'

export class ScheduleRepositoryPrisma {
  constructor(private readonly prisma: PrismaClient) {}

  async createSchedule(scheduleData: SchedulePayload, userId: number): Promise<Schedule> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: scheduleData.movie_id }
    })
    if (!movie) {
      throw new NotFoundException(`Film dengan id ${scheduleData.movie_id} tidak ditemukan`)
    }
    await checkExists(this.prisma.studio, scheduleData.studio_id, 'Studio')

    const startTimeAsDate = new Date(scheduleData.start_time)
    const durationInMinutes = parseDurationToMinutes(movie.duration)
    const finishedTimeAsDate = new Date(startTimeAsDate.getTime() + durationInMinutes * 60000)

    const conflictingSchedule = await this.prisma.schedule.findFirst({
      where: {
        studio_id: scheduleData.studio_id,
        AND: [
          {
            start_time: { lt: finishedTimeAsDate }
          },
          {
            finished_time: { gt: startTimeAsDate }
          }
        ]
      }
    })

    if (conflictingSchedule) {
      throw new BadRequestException('Jadwal konflik dengan jadwal lainnya')
    }

    const newSchedule = await this.prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.create({
        data: {
          movie_id: scheduleData.movie_id,
          studio_id: scheduleData.studio_id,
          start_time: startTimeAsDate,
          finished_time: finishedTimeAsDate,
          date: startTimeAsDate,
          price: scheduleData.price,
          created_by_id: userId
        }
      })

      const seatsInStudio = await tx.seat.findMany({
        where: { studio_id: scheduleData.studio_id },
        select: { id: true }
      })

      const scheduleSeatData = seatsInStudio.map((seat) => ({
        schedule_id: schedule.id,
        seat_id: seat.id,
        status: SeatStatus.available
      }))

      await tx.scheduleSeat.createMany({
        data: scheduleSeatData
      })

      return schedule
    })

    return newSchedule
  }
}
