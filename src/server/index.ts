import 'dotenv/config'
import App from '../applications/app'
import { logger } from '../shared/logger/logger'
import { Routes } from '../applications/routes/routes'

async function bootstrap() {
  try {
    const routes = new Routes()
    const app = new App(routes)
    await app.start()
    logger.info({
      from: 'index:bootstrap',
      message: '✅ Server started ✅'
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
