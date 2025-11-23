import { PrismaClient } from '@prisma/client'
import { logger } from '@/shared/logger/logger'

export const tableName = 'Users'

export default async function seed(prisma: PrismaClient) {
  await prisma.user.create({
    data: {
      name: 'Joker',
      email: 'joker@gmail.com',
      role: 'admin',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$TaN2PghN6q6y+LR/1ARIWg$9j3LWlauGB/qrgBhP8oRhjHnkarExk7CQ+qdCG9xQUQ'
    }
  })
  logger.info({
    from: 'seed:admin',
    message: 'Admin seeded successfully ✅'
  })
}
