import 'dotenv/config'
import App from '../applications/app'
import { logger } from '../shared/utils/logger'
import { Routes } from '../applications/routes/routes'

async function bootstrap() {
  try {
    const routes = new Routes()
    const app = new App(routes)
    await app.start()
    logger.info('✅ Message from bootstrap: Server successfully started')
  } catch (error) {
    logger.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

bootstrap()
