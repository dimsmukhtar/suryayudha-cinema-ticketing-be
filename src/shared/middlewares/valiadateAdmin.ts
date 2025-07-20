import { NextFunction, Request, Response } from 'express'
import { ForbiddenException } from '../../shared/error-handling/exceptions/forbidden-exception'

export const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  return next(new ForbiddenException('Forbidden! only admin can access this'))
}
