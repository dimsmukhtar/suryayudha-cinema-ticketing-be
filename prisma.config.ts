import dotenv from 'dotenv'
import path from 'path'
import { defineConfig } from 'prisma/config'

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env.development'

dotenv.config({
  path: path.resolve(process.cwd(), envFile)
})

export default defineConfig({
  schema: './src/infrastructure/database/prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL as string
  }
})
