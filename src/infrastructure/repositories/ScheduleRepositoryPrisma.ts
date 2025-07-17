import {
  MovieStatus,
  Prisma,
  PrismaClient,
  Schedule,
  ScheduleSeat,
  SeatStatus
} from '@prisma/client'
import { SchedulePayload, ScheduleQuery } from '../../infrastructure/types/entities/ScheduleTypes'
import { parseDurationToMinutes } from '../../shared/helpers/parseDuration'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { checkExists } from '../../shared/helpers/checkExistingRow'
import { BadRequestException } from '../../shared/error-handling/exceptions/bad-request.exception'
import { ScheduleWithScheduleSeats } from '../types/entities/ScheduleTypes'
import { ConflictException } from '../../shared/error-handling/exceptions/conflict.exception'
import { transformSeatsLayout } from '../../shared/helpers/seatsLayout'

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

  async getAllSchedules(query: ScheduleQuery): Promise<Schedule[]> {
    const where: Prisma.ScheduleWhereInput = {}
    if (query.status) {
      where.movie = {
        status: query.status as MovieStatus
      }
    }
    if (query.date) {
      const startDate = new Date(query.date)

      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 1)

      where.start_time = {
        gte: startDate,
        lt: endDate
      }
    }
    return await this.prisma.schedule.findMany({
      where,
      include: {
        movie: true,
        studio: true
      },
      orderBy: {
        start_time: 'asc'
      }
    })
  }

  async getScheduleById(scheduleId: number): Promise<Schedule> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: scheduleId }
    })

    if (!schedule) {
      throw new NotFoundException(`Schedule dengan id ${scheduleId} tidak ditemukan`)
    }

    return schedule
  }

  async deleteSchedule(scheduleId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const schedule = await tx.schedule.findUnique({ where: { id: scheduleId } })
      if (!schedule) {
        throw new NotFoundException(`Schedule dengan id ${scheduleId} tidak ditemukan`)
      }
      const bookedSeatsCount = await tx.scheduleSeat.count({
        where: {
          schedule_id: scheduleId,
          status: {
            not: SeatStatus.available
          }
        }
      })

      if (bookedSeatsCount > 0) {
        throw new ConflictException(
          'Tidak dapat menghapus schedule, karena terdapat seat yang sudah dibooking'
        )
      }

      await tx.schedule.delete({ where: { id: scheduleId } })
    })
  }

  async getScheduleLayout(scheduleId: number) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        movie: { select: { title: true } },
        studio: { select: { name: true, screen_placement: true } }
      }
    })

    if (!schedule) {
      throw new NotFoundException(`Jadwal dengan id ${scheduleId} tidak ditemukan`)
    }

    const allStudioSeats = await this.prisma.seat.findMany({
      where: { studio_id: schedule.studio_id }
    })

    const allScheduleSeats = await this.prisma.scheduleSeat.findMany({
      where: { schedule_id: scheduleId }
    })

    const seatStatusMap = new Map<number, { id: number; status: SeatStatus }>()
    allScheduleSeats.forEach((scheduleSeat) => {
      seatStatusMap.set(scheduleSeat.seat_id, { id: scheduleSeat.id, status: scheduleSeat.status })
    })

    const combinedSeatData = allStudioSeats.map((seat) => {
      const seatInfo = seatStatusMap.get(seat.id)
      if (!seatInfo) {
        return {
          seatId: seat.id,
          scheduleSeatId: null,
          label: seat.seat_label,
          status: SeatStatus.available
        }
      }
      return {
        seatId: seat.id,
        scheduleSeatId: seatInfo.id,
        label: seat.seat_label,
        status: seatInfo.status
      }
    })

    const finalSeatLayout = transformSeatsLayout(combinedSeatData, schedule.studio_id)

    const responseData = {
      schedule: {
        id: schedule.id,
        movieTitle: schedule.movie.title,
        studioName: schedule.studio.name,
        startTime: schedule.start_time,
        price: schedule.price,
        screenPlacement: schedule.studio.screen_placement
      },
      seatLayout: finalSeatLayout
    }

    return responseData
  }

  async updateScheduleSeatStatus(scheduleSeatId: number, status: string): Promise<ScheduleSeat> {
    await checkExists(this.prisma.scheduleSeat, scheduleSeatId, 'Schedule Seat')
    return await this.prisma.scheduleSeat.update({
      where: { id: scheduleSeatId },
      data: { status: status as SeatStatus }
    })
  }
}
