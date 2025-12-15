import { Request, Response, NextFunction } from 'express'
import redis from '../config/redis'
import { logger } from '@/shared/logger/logger'

export function cache({ prefix = 'cache', ttl = 60 * 5, spesificUser = false } = {}) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      let key = `${prefix}:${req.originalUrl}`
      if (spesificUser === true) {
        key = `${req.user?.id}:${prefix}:${req.originalUrl}`
        // contoh key jika user id 1 = 1:my-transactions:/api/v1/transactions/my
      }
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
