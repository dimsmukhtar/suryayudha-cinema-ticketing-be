import { PrismaClient } from '@prisma/client'
import { logger } from '@/shared/logger/logger'

export const tableName = 'Users'

export default async function seedAdmin(prisma: PrismaClient) {
  try {
    await prisma.user.create({
      data: {
        name: 'Joker',
        email: 'joker@gmail.com',
        role: 'admin',
        password: 'jokerjoker'
      }
    })
    logger.info({
      from: 'seed:admin',
      message: 'Admin seeded successfully ✅'
    })
  } catch (e) {
    logger.error({
      from: 'seed:admin',
      message: '❌ Failed to seed admin ❌',
      error: e
    })
  }
}
