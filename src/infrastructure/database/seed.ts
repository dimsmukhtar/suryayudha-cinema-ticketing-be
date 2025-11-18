import { prisma } from '../config/clientPrisma'
import { logger } from '@shared/logger/logger'

interface SeatData {
  seat_label: string
  studio_id: string
}

async function main() {
  logger.info('✅ Starting the seed script ✅')

  logger.info('Creating 3 studio...⌛')
  const studio1 = await prisma.studio.create({
    data: {
      id: 'cinema-1',
      name: 'Cinema 1',
      screen_placement: 'right'
    }
  })
  const studio2 = await prisma.studio.create({
    data: {
      id: 'cinema-2',
      name: 'Cinema 2',
      screen_placement: 'left'
    }
  })
  const studio3 = await prisma.studio.create({
    data: {
      id: 'cinema-3',
      name: 'Cinema 3',
      screen_placement: 'right'
    }
  })
  // seat for studio 1, total 155 seat
  const seatsDataForStudio1: SeatData[] = []
  const studioId1: string = studio1.id

  logger.info('Creating seats for studio 1...⌛')
  for (let i = 1; i <= 15; i++) {
    seatsDataForStudio1.push({
      seat_label: `A${i}`,
      studio_id: studioId1
    })
  }
  const restColumnStudio1 = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
  restColumnStudio1.forEach((column) => {
    for (let i = 1; i <= 14; i++) {
      seatsDataForStudio1.push({
        seat_label: `${column}${i}`,
        studio_id: studioId1
      })
    }
  })

  // seat for studio 2, total 168 seat
  const seatsDataForStudio2: SeatData[] = []
  const studioId2: string = studio2.id

  logger.info('Creating seats for studio 2...⌛')
  const columnStudio2 = ['A', 'B']
  columnStudio2.forEach((column) => {
    for (let i = 1; i <= 12; i++) {
      seatsDataForStudio2.push({
        seat_label: `${column}${i}`,
        studio_id: studioId2
      })
    }
  })
  const restColumnStudio2 = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
  restColumnStudio2.forEach((column) => {
    for (let i = 1; i <= 16; i++) {
      seatsDataForStudio2.push({
        seat_label: `${column}${i}`,
        studio_id: studioId2
      })
    }
  })

  // seat for studio 3, total 156 seat
  const seatsDataForStudio3: SeatData[] = []
  const studioId3: string = studio3.id

  logger.info('Creating seats for studio 3...⌛')
  for (let i = 1; i <= 14; i++) {
    seatsDataForStudio3.push({
      seat_label: `A${i}`,
      studio_id: studioId3
    })
  }
  for (let i = 1; i <= 12; i++) {
    seatsDataForStudio3.push({
      seat_label: `G${i}`,
      studio_id: studioId3
    })
  }
  const restColumnStudio3 = ['B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K', 'L']
  restColumnStudio3.forEach((column) => {
    for (let i = 1; i <= 13; i++) {
      seatsDataForStudio3.push({
        seat_label: `${column}${i}`,
        studio_id: studioId3
      })
    }
  })

  const allSeats: SeatData[] = [
    ...seatsDataForStudio1,
    ...seatsDataForStudio2,
    ...seatsDataForStudio3
  ]

  await prisma.seat.createMany({
    data: allSeats
  })

  logger.info('✅ Successfully Finished the seed script ✅')
}

main().catch((e) => {
  logger.error('❌❌❌ Failed to seed database ❌❌❌')
  logger.error(e)
})
