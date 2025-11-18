import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../exceptions/http.exception'
import multer from 'multer'
import { logger } from '@shared/logger/logger'

interface ErrorRequestHandler {
  (error: Error, req: Request, res: Response, next: NextFunction): void
}

export const errorMiddleware: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpException) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json(error.serialize())
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      errorCode: 'BAD_REQUEST_ERROR_CODE',
      message: error.message
    })
  }

  logger.error('unhandled:error', {
    message: error?.message ?? String(error),
    name: error?.name,
    stack: error?.stack,
    method: req.method,
    url: req.originalUrl || req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    statusCode: 500
  })
  const isProduction = process.env.NODE_ENV === 'production'
  res.status(500).json({
    success: false,
    statusCode: 500,
    errorCode: 'UNKNOWN_ERROR_CODE',
    message: isProduction ? 'SOMETHING WENT WRONG' : error.message,
    ...(!isProduction && { stack: error.stack })
  })
}
