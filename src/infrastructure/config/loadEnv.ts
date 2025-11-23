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
  message: `✅ Environment set to ${env} and using ${envFile} file ✅`
})
dotenv.config({ path: envFile })
