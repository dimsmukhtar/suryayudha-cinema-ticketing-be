import { Request, Response, NextFunction } from 'express'
import { UnauthorizedException } from '../error-handling/exceptions/unauthorized.exception'
import { verifyJwtToken } from '@infrastructure/config/jwt'
import { HttpException } from '../error-handling/exceptions/http.exception'
import { UserJwtPayload } from '@infrastructure/types/entities/UserTypes'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken
    if (!accessToken) {
      return next(new UnauthorizedException('Akses ditolak, silahkan login terlebih dahulu'))
    }

    const payload = verifyJwtToken(accessToken, 'ACCESS_TOKEN_PUBLIC_KEY') as UserJwtPayload
    if (!payload) {
      return next(
        new UnauthorizedException(
          'Silahkan login terlebih dahulu, akses ditolak karena token tidak valid'
        )
      )
    }
    req.user = payload
    next()
  } catch (e: any) {
    return next(new HttpException(e.statusCode, e.message))
  }
}
