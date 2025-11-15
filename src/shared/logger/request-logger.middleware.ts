import { Request, Response, NextFunction } from 'express'
import { logger } from './logger'
import { asyncContext } from './async-context'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  asyncContext.runWithId(() => {
    const requestId = asyncContext.getRequestId()
    const start = Date.now()

    logger.info('request:start', {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId
    })

    if (req.method !== 'GET' && req.body) {
      logger.debug('request:body', { body: req.body })
    }

    res.on('finish', () => {
      const duration = Date.now() - start
      logger.info('request:finish', {
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        durationMs: duration,
        requestId
      })
    })
    next()
  })
}
