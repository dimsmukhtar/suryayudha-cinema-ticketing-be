import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../exceptions/http.exception'
import multer from 'multer'

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

  const isProduction = process.env.NODE_ENV === 'PRODUCTION'
  res.status(500).json({
    success: false,
    statusCode: 500,
    errorCode: 'UNKNOWN_ERROR_CODE',
    message: isProduction ? 'SOMETHING WENT WRONG' : error.message,
    ...(!isProduction && { stack: error.stack })
  })
}
