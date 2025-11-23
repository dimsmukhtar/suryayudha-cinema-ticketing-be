import Redis, { RedisOptions } from 'ioredis'
import { URL } from 'url'
import { logger } from '@shared/logger/logger'

const redisUrl = `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`

function createRedis(urlStr: string) {
  try {
    const url = new URL(urlStr)
    const options: RedisOptions = {}
    if (url.username && url.password) options.password = url.password
    if (url.protocol === 'rediss:') {
      options.tls = {} as any
    }
    return new Redis(urlStr, options)
  } catch (e) {
    logger.error({
      from: 'config:redis',
      message: '❌ Failed to connect to redis ❌'
    })
    throw e
  }
}

const redis = createRedis(redisUrl)
redis.on('connect', () =>
  logger.info({
    from: 'config:redis',
    message: '✅ Connected to redis ✅'
  })
)
redis.on('ready', () =>
  logger.info({
    from: 'config:redis',
    message: '✅ Redis is ready ✅'
  })
)
redis.on('error', (e) =>
  logger.error({
    from: 'config:redis',
    message: '❌ Redis connection error ❌',
    error: e
  })
)

export default redis
