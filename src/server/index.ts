import 'dotenv/config'
import App from '../applications/app'
import { logger } from '../shared/utils/logger'

async function main() {
  try {
    const app = new App()
    await app.start()
    console.log('Server started')
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

main()
