import { prisma } from '@infrastructure/config/clientPrisma'

async function resetTable() {
  return await prisma.$executeRaw`TRUNCATE TABLE`
}
