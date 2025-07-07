import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../exceptions/http.exception'

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

  const isProduction = process.env.NODE_ENV === 'PRODUCTION'
  res.status(500).json({
    success: false,
    statusCode: 500,
    errorCode: 'UNKNOWN_ERROR_CODE',
    message: isProduction ? 'SOMETHING WENT WRONG' : error.message,
    ...(!isProduction && { stack: error.stack })
  })
}
