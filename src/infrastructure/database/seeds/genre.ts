import { PrismaClient } from '@prisma/client'
import data from './data/genres.json'
import { logger } from '@shared/logger/logger'

export const tableName = 'Genres'

export default async function seedGenres(prisma: PrismaClient) {
  try {
    await prisma.genre.createMany({
      data: data
    })

    logger.info({
      from: 'seed:genre',
      message: 'Genre seeded successfully ✅'
    })
  } catch (e) {
    logger.error({
      from: 'seed:genre',
      message: '❌ Failed to seed genre ❌',
      error: e
    })
  }
}
