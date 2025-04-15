import { Request, Response, NextFunction } from 'express'
import CustomError from '../types/error.type'

export default function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  err.statusCode = err.statusCode || 500
  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    console.log(err.stack)
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message
  })
}
