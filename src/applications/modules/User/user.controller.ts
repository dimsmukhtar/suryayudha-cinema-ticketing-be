import { Request, Response, NextFunction, Router } from 'express'
import { UserService } from './user.service'
import { UserPayload, UserUpdatePayload } from '@infrastructure/types/entities/UserTypes'
import { upload } from '@infrastructure/config/multer.config'
import { authenticate } from '@shared/middlewares/authenticate'
import { validateAdmin } from '@shared/middlewares/valiadateAdmin'

export class UserController {
  private readonly userRouter: Router
  constructor(private readonly service: UserService) {
    this.userRouter = Router()
    this.initializeUserRoutes()
  }

  private initializeUserRoutes() {
    this.userRouter.get('/', authenticate, validateAdmin, this.getAllUsers)
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
    this.userRouter.get('/:id/tickets', authenticate, validateAdmin, this.getTicketsForUser)
  }

  private getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const name = req.query.name as string | undefined

      const { users, total } = await this.service.getAllUsers(page, limit, name)

      res.status(200).json({
        success: true,
        message: 'Semua user berhasil diambil',
        data: users,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
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

  private getTicketsForUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id)
      const tickets = await this.service.getTicketsForUser(userId)
      res.status(200).json({ success: true, message: 'Tiket user berhasil diambil', data: tickets })
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

  public getRoutes(): Router {
    return this.userRouter
  }
}
