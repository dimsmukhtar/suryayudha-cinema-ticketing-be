import { prisma } from '@infrastructure/config/clientPrisma'
import * as seeds from './seeds'
import { logger } from '@/shared/logger/logger'

const tablesName = [
  seeds.admin.tableName,
  seeds.studioAndSeat.tableName,
  seeds.studioAndSeat.tableName2,
  seeds.genre.tableName,
  seeds.movie.tableName
]

async function resetTable() {
  for (const tableName of tablesName) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableName} RESTART INDENTITY CASCADE`)
    logger.info({
      from: 'seed:resetTable',
      message: `Table ${tableName} reseted successfully ✅`
    })
  }
}

const seedsOrder = [seeds.admin, seeds.studioAndSeat, seeds.genre, seeds.movie]

async function runSeeds() {
  await resetTable()

  logger.info({
    from: 'seed:runSeeds',
    message: 'Running seeds...⌛'
  })

  for (const seed of seedsOrder) {
    await seed.default(prisma)
  }

  logger.info({
    from: 'seed:runSeeds',
    message: 'Seeding finished successfully ✅'
  })
}

runSeeds().catch((err) => {
  console.error('❌ Error during seeding:', err)
})
