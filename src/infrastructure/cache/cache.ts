import { Request, Response, NextFunction } from 'express'
import redis from '../config/redis'
import { logger } from '@/shared/logger/logger'

export function cache({ prefix = 'cache', ttl = 60 * 5 } = {}) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const key = `${prefix}:${req.originalUrl}`
      const cached = await redis.get(key)
      if (cached) {
        res.set('X-Cache', 'HIT')
        return res.json(JSON.parse(cached))
      }
      ;(res as any).cacheKey = key
      ;(res as any).cacheTTL = ttl
      res.set('X-Cache', 'MISS')
      next()
    } catch (e) {
      logger.error({
        from: 'cache:middleware',
        message: 'Cache middleware error ❌',
        error: e
      })
      next()
    }
  }
}
