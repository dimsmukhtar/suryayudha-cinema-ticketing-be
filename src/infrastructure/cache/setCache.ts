import { logger } from '@/shared/logger/logger'
import redis from '../config/redis'

export async function setCache(key: string, value: any, ttlSeconds = 60 * 5) {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  } catch (e) {
    logger.error({
      from: 'cache:setCache',
      message: 'Error while caching ❌',
      error: e
    })
  }
}
