import dotenv from 'dotenv'
import * as fs from 'fs'
import { logger } from '@shared/logger/logger'

const env = process.env.NODE_ENV || 'development'
const envFile = `.env.${env}`

if (!fs.existsSync(envFile)) {
  logger.error({
    from: 'index:boostrap',
    message: '❌ Environment file not found, Set NODE_ENV to one of: development, test, production'
  })
  process.exit(1)
}
logger.info({
  from: 'index:boostrap',
  message: `✅ Environment set to ${env} ✅`
})
dotenv.config({ path: envFile })

import { Routes } from '../applications/routes/routes'
import App from '../applications/app'
async function bootstrap() {
  try {
    const routes = new Routes()
    const app = new App(routes)
    await app.start()
    logger.info({
      from: 'index:bootstrap',
      message: '✅ Server successfully started ✅'
    })
  } catch (error) {
    logger.error({
      from: 'index:bootstrap',
      message: '❌ Failed to start server ❌',
      error
    })
    process.exit(1)
  }
}

bootstrap()
