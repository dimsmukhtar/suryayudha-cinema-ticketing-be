import { Request, Response, NextFunction, Router } from 'express'
import { UserService } from './user.service'
import {
  RegisterPayload,
  UserPayload,
  UserUpdatePayload
} from '../../../infrastructure/types/entities/UserTypes'
import { uploadImageToImageKit } from '../../../shared/utils/imagekit.config'
import { upload } from '../../../shared/utils/multer.config'
export class UserController {
  private readonly userRouter: Router
  constructor(private readonly service: UserService) {
    this.userRouter = Router()
    this.initializeUserRoutes()
  }

  private initializeUserRoutes() {
    this.userRouter.get('/', this.getAllUsers)
    this.userRouter.post('/', this.createUser)
    this.userRouter.get('/:id', this.getUserById)
    this.userRouter.delete('/:id', this.deleteUser)
    this.userRouter.patch('/:id', upload.single('profile_url'), this.updateUser)

    this.userRouter.post('/register', this.register)
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
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
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
          'Berhasil register dan token verifikasi telah dikirim ke email anda!, silahkan cek email untuk verifikasi'
      })
    } catch (e) {
      console.log(e)
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.userRouter
  }
}
