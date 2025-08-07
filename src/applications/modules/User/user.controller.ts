import { Request, Response, NextFunction, Router } from 'express'
import { UserService } from './user.service'
import {
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UserPayload,
  UserUpdatePayload
} from '../../../infrastructure/types/entities/UserTypes'
import { setAccessToken } from '../../../shared/helpers/setCookies'
import { upload } from '../../../shared/utils/multer.config'
import { generateVerificationToken } from '../../../shared/helpers/generateVerificationToken'
import { authenticate } from '../../../shared/middlewares/authenticate'
import { validateAdmin } from '../../../shared/middlewares/valiadateAdmin'
import { BadRequestException } from '../../../shared/error-handling/exceptions/bad-request.exception'
import { UnauthorizedException } from '../../../shared/error-handling/exceptions/unauthorized.exception'
export class UserController {
  private readonly userRouter: Router
  constructor(private readonly service: UserService) {
    this.userRouter = Router()
    this.initializeUserRoutes()
  }

  private initializeUserRoutes() {
    this.userRouter.get('/', authenticate, validateAdmin, this.getAllUsers)

    this.userRouter.post('/register', this.register)
    this.userRouter.post('/resend-verification-token', this.resendVerificationLink)
    this.userRouter.get('/verify-email', this.verifyEmail)
    this.userRouter.post('/login', this.login)
    this.userRouter.get('/check-auth', this.checkAuthentication)
    this.userRouter.post('/login-admin', this.loginAdmin)
    this.userRouter.post('/logout', this.logout)
    this.userRouter.get('/profile', authenticate, this.getProfile)
    this.userRouter.patch(
      '/update-profile',
      authenticate,
      upload.single('profile_url'),
      this.updateProfile
    )
    this.userRouter.patch('/change-password', authenticate, this.changePassword)
    this.userRouter.post('/forgot-password', this.sendTokenResetPassword)
    this.userRouter.post('/reset-password', this.resetPassword)

    this.userRouter.post('/', authenticate, validateAdmin, this.createUser)
    this.userRouter.patch(
      '/:id',
      authenticate,
      validateAdmin,
      upload.single('profile_url'),
      this.updateUser
    )
    this.userRouter.delete('/:id', authenticate, validateAdmin, this.deleteUser)
    this.userRouter.get('/:id', authenticate, validateAdmin, this.getUserById)
  }

  private getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.service.getAllUsers()
      res.status(200).json({ success: true, message: 'Data user berhasil didapatkan', data: users })
    } catch (e) {
      next(e)
    }
  }

  private getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.getUserById(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Data user berhasil didapatkan', data: user })
    } catch (e) {
      next(e)
    }
  }

  private createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createUserPayload: UserPayload = {
        ...req.body,
        profile_url: 'https://ik.imagekit.io/yxctvbjvh/profilepic.png?updatedAt=1734338115538'
      }
      const user = await this.service.createUser(createUserPayload)
      res.status(201).json({ success: true, message: 'User berhasil dibuat', data: user })
    } catch (e) {
      next(e)
    }
  }

  private updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file) {
        req.body.profile_url = req.file
      }
      const updateUserPayload: UserUpdatePayload = req.body
      const user = await this.service.updateUser(parseInt(req.params.id), updateUserPayload)
      res.status(200).json({ success: true, message: 'User berhasil diupdate', data: user })
    } catch (e) {
      next(e)
    }
  }

  private deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteUser(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'User berhasil dihapus' })
    } catch (e) {
      next(e)
    }
  }

  private register = async (req: Request, res: Response, next: NextFunction) => {
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
      res.status(201).json({
        success: true,
        message:
          'Berhasil register dan verifikasi link telah dikirim ke email anda!, silahkan cek email untuk verifikasi'
      })
    } catch (e) {
      console.log(e)
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
      const token = await this.service.login('user', loginPayload)
      setAccessToken(token, res)
      res.status(200).json({ success: true, message: 'Login berhasil', token })
    } catch (e) {
      next(e)
    }
  }

  private loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginPayload: LoginPayload = req.body
      const token = await this.service.login('admin', loginPayload)
      setAccessToken(token, res)
      res.status(200).json({ success: true, message: 'Login admin berhasil', token })
    } catch (e) {
      next(e)
    }
  }

  private logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      res.status(200).json({ success: true, message: 'Logout berhasil' })
    } catch (e) {
      next(e)
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
      console.log(e)
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
    return this.userRouter
  }
}
