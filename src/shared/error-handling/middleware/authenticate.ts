import { Request, Response, NextFunction } from 'express'
import { UnauthorizedException } from '../exceptions/unauthorized.exception'
import { verifyJwtToken } from '../../../shared/utils/jwt'
import { HttpException } from '../exceptions/http.exception'
import { UserJwtPayload } from '../../../infrastructure/types/entities/UserTypes'

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
