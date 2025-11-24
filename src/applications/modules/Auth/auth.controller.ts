import { Request, Response, NextFunction, Router } from 'express'
import passport from 'passport'
import { AuthService } from './auth.service'
import {
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload
} from '@infrastructure/types/entities/AuthTypes'

import { UserJwtPayload, UserUpdatePayload } from '@infrastructure/types/entities/UserTypes'
import { setAccessToken, setRefreshToken } from '@shared/helpers/setCookies'
import { upload } from '@infrastructure/config/multer.config'
import { generateVerificationToken } from '@shared/helpers/generateVerificationToken'
import { authenticate } from '@shared/middlewares/authenticate'
import { BadRequestException } from '@shared/error-handling/exceptions/bad-request.exception'
import { UnauthorizedException } from '@shared/error-handling/exceptions/unauthorized.exception'
import { signJwt } from '@infrastructure/config/jwt'
import { logger } from '@shared/logger/logger'
import { sanitizeBody } from '@shared/helpers/sanitizeBody'
import redis from '@infrastructure/config/redis'
import { verifyJwtToken } from '@infrastructure/config/jwt'
import { clearAuthCookies } from '@/shared/helpers/clearCookies'

export class AuthController {
  private readonly authRouter: Router
  constructor(private readonly service: AuthService) {
    this.authRouter = Router()
    this.initializeAuthRoutes()
  }

  private initializeAuthRoutes() {
    this.authRouter.post('/register', this.register)
    this.authRouter.post('/login', this.login)
    this.authRouter.post('/refresh', this.refreshToken)
    this.authRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
    this.authRouter.get(
      '/facebook',
      passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
    )
    this.authRouter.get(
      '/google/callback',
      passport.authenticate('google', {
        session: false,
        failureRedirect: process.env.CLIENT_URL + '/login'
      }),
      this.googleOauthCallback
    )
    this.authRouter.get(
      '/facebook/callback',
      passport.authenticate('facebook', {
        session: false,
        failureRedirect: process.env.CLIENT_URL + '/login'
      }),
      this.facebookOauthCallback
    )
    this.authRouter.post('/login-admin', this.loginAdmin)
    this.authRouter.post('/resend-verification-token', this.resendVerificationLink)
    this.authRouter.get('/verify-email', this.verifyEmail)
    this.authRouter.get('/profile', authenticate, this.getProfile)
    this.authRouter.patch(
      '/update-profile',
      authenticate,
      upload.single('profile_url'),
      this.updateProfile
    )
    this.authRouter.patch('/change-password', authenticate, this.changePassword)
    this.authRouter.post('/forgot-password', this.sendTokenResetPassword)
    this.authRouter.post('/reset-password', this.resetPassword)
    this.authRouter.get('/check-auth', this.checkAuthentication)
    this.authRouter.post('/logout', this.logout)
  }

  private register = async (req: Request, res: Response, next: NextFunction) => {
    logger.info({
      from: 'auth:register:controller',
      message: `Register request untuk email: ${req.body.email}`,
      body: sanitizeBody(req.body)
    })
    try {
      const verificationToken = generateVerificationToken()
      const verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 menit
      req.body.verification_token = verificationToken
      req.body.verification_token_expires_at = verificationTokenExpiresAt
      req.body.role = 'user'
      req.body.is_verified = false
      req.body.profile_url =
        'https://ik.imagekit.io/yxctvbjvh/profilepic.png?updatedAt=1734338115538'
      const registerPayload: RegisterPayload = req.body
      await this.service.register(registerPayload)
      logger.info({
        from: 'auth:register:controller',
        message: `Register berhasil untuk email: ${req.body.email}`
      })
      res.status(201).json({
        success: true,
        message:
          'Berhasil register dan verifikasi link telah dikirim ke email anda!, silahkan cek email untuk verifikasi'
      })
    } catch (e) {
      next(e)
    }
  }

  private resendVerificationLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.resendVerificationLink(req.body.email)
      res.status(200).json({ success: true, message: 'Link verifikasi berhasil dikirim ulang' })
    } catch (e) {
      next(e)
    }
  }

  private verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, email } = req.query
      if (!token || !email) {
        throw new BadRequestException('Token dan email diperlukan untuk verifikasi')
      }
      await this.service.verifyEmail(token as string, email as string)
      res.status(200).json({ success: true, message: 'Email berhasil diverifikasi' })
    } catch (e) {
      next(e)
    }
  }

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginPayload: LoginPayload = req.body
      const { accessToken, refreshToken } = await this.service.login('user', loginPayload)
      setAccessToken(accessToken, res)
      setRefreshToken(refreshToken, res)
      res.status(200).json({ success: true, message: 'Login berhasil' })
    } catch (e) {
      next(e)
    }
  }

  private refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken
      const { newAccessToken, newRefreshToken } = await this.service.refreshToken(refreshToken)
      setAccessToken(newAccessToken, res)
      setRefreshToken(newRefreshToken, res)
      res.status(200).json({ success: true, message: 'Refresh token berhasil' })
    } catch (e) {
      next(e)
    }
  }

  private googleOauthCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user) {
        throw new UnauthorizedException('User tidak ditemukan dari google oauth')
      }
      const token = signJwt(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        'ACCESS_TOKEN_PRIVATE_KEY',
        { expiresIn: '60m' } // best pratice use 15 minutes with refresh token, but now i dont have refresh token yet, so i set 60 minutes
      )
      setAccessToken(token, res)
      res.redirect(process.env.CLIENT_URL!)
    } catch (e) {
      next(e)
    }
  }
  private facebookOauthCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user) {
        throw new UnauthorizedException('User tidak ditemukan dari facebook oauth')
      }
      const token = signJwt(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        'ACCESS_TOKEN_PRIVATE_KEY',
        { expiresIn: '60m' } // best pratice use 15 minutes with refresh token, but now i dont have refresh token yet, so i set 60 minutes
      )
      setAccessToken(token, res)
      res.redirect(process.env.CLIENT_URL!)
    } catch (e) {
      next(e)
    }
  }

  private loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginPayload: LoginPayload = req.body
      const { accessToken, refreshToken } = await this.service.login('admin', loginPayload)
      setAccessToken(accessToken, res)
      setRefreshToken(refreshToken, res)
      res.status(200).json({ success: true, message: 'Login admin berhasil' })
    } catch (e) {
      next(e)
    }
  }

  private logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken
      if (!refreshToken) {
        clearAuthCookies(res)
        return res.status(200).json({ success: true, message: 'Logout berhasil' })
      }
      try {
        const payload = verifyJwtToken<UserJwtPayload & { jti: string }>(
          refreshToken,
          'REFRESH_TOKEN_PUBLIC_KEY'
        )
        if (payload?.jti) {
          await redis.del(`refresh-token:${payload.jti}`)
        }
      } catch (err) {
        logger.error({
          from: 'auth:logout',
          message: '❌ Logout cleanup failed ❌',
          error: err
        })
      }

      clearAuthCookies(res)
      res.status(200).json({ success: true, message: 'Logout berhasil' })
    } catch (e) {
      clearAuthCookies(res)
      return res.status(200).json({ success: true, message: 'Logout berhasil' })
    }
  }

  private getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id
      const user = await this.service.getProfile(userId)
      const {
        password,
        verification_token,
        verification_token_expires_at,
        reset_password_token,
        reset_password_token_expires_at,
        ...rest
      } = user
      res.status(200).json({ success: true, message: 'Profile berhasil diambil', data: rest })
    } catch (e) {
      next(e)
    }
  }

  private updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file) {
        req.body.profile_url = req.file
      }
      const updateProfilePayload: UserUpdatePayload = req.body
      const userId = req.user!.id
      const user = await this.service.updateProfile(userId, updateProfilePayload)
      const { password, ...rest } = user
      res.status(200).json({ success: true, message: 'Profile berhasil diupdate', data: rest })
    } catch (e) {
      next(e)
    }
  }

  private changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const changePasswordPayload: ChangePasswordPayload = req.body
      const email = req.user!.email
      const user = await this.service.changePassword(email, changePasswordPayload)
      const { password, ...rest } = user
      res.status(200).json({ success: true, message: 'Password berhasil diubah', data: rest })
    } catch (e) {
      next(e)
    }
  }

  private sendTokenResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: { email: string } = {
        ...req.body
      }
      await this.service.sendTokenResetPassword(data)
      res.status(200).json({ success: true, message: 'Token reset password berhasil dikirim' })
    } catch (e) {
      next(e)
    }
  }

  private resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resetPasswordPayload: ResetPasswordPayload = req.body
      const user = await this.service.resetPassword(resetPasswordPayload)
      const { password, ...rest } = user
      res.status(200).json({ success: true, message: 'Password berhasil direset', data: rest })
    } catch (e) {
      next(e)
    }
  }

  private checkAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken
      if (!token) {
        return next(new UnauthorizedException('Tidak terautentikasi'))
      }
      res.status(200).json({ success: true, message: 'Autentikasi berhasil' })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.authRouter
  }
}
