import { logger } from '@/shared/logger/logger'
import redis from '../config/redis'

export async function clearingCacheByPrefix(prefix: string) {
  try {
    const keys = await redis.keys(`${prefix}:*`)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
    logger.info({
      from: 'deleteCache',
      message: `Cleared ${keys.length} for prefix ${prefix} ✅`
    })
  } catch (e) {
    logger.error({
      from: 'deleteCache',
      message: `Error while cleared cache for prefix ${prefix} ❌`,
      error: e
    })
  }
}
