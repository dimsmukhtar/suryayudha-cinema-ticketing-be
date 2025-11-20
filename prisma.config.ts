import dotenv from 'dotenv'
import path from 'path'

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env.development'

dotenv.config({
  path: path.resolve(process.cwd(), envFile)
})

export default {
  schema: './src/infrastructure/database/prisma/schema.prisma'
}
