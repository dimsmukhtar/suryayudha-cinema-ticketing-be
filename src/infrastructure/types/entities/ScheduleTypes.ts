import { Prisma, ScreenPlacement, SeatStatus } from '@prisma/client'

export type SchedulePayload = {
  price: number
  start_time: string
  movie_id: number
  studio_id: string
}

export type ScheduleWithScheduleSeats = Prisma.ScheduleGetPayload<{
  include: {
    schedule_seats: true
  }
}>

export type ScheduleQuery = {
  date?: string
  status?: string
}
