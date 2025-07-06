import { Request, Response, NextFunction, Router } from 'express'
import { UserService } from './user.service'
import { UserPayload, UserUpdatePayload } from '../../../infrastructure/types/entities/UserTypes'
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
    this.userRouter.get('/:id', this.getUserById)
    this.userRouter.post('/', this.createUser)
    this.userRouter.patch('/:id', upload.single('profile_url'), this.updateUser)
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
      const createUserPayload: UserPayload = req.body
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

  public getRoutes(): Router {
    return this.userRouter
  }
}
