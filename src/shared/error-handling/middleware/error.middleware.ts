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
    return res.status(error.statusCode).json(error.toJSON())
  }
  const isProduction = process.env.NODE_ENV === 'production'
  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: isProduction ? 'Internal server error' : error.message,
    ...(!isProduction && { stack: error.stack })
  })
}
