import { Request, Response, NextFunction } from 'express'
import { logger } from './logger'
import { asyncContext } from './async-context'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  asyncContext.runWithId(() => {
    const requestId = asyncContext.getRequestId()
    const start = Date.now()

    logger.info({
      from: 'request:logger:middleware',
      message: 'Request started',
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId
    })

    res.on('finish', () => {
      const duration = Date.now() - start
      logger.info({
        from: 'request:logger:middleware',
        message: 'Request finished',
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
