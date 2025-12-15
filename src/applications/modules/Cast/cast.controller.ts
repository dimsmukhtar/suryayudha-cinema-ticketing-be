import { Router, Request, Response, NextFunction } from 'express'
import { CastService } from './cast.service'
import { upload } from '@infrastructure/config/multer.config'
import { CastPayload, CastPayloadUpdate } from '@infrastructure/types/entities/CastTypes'
import { BadRequestException } from '@shared/error-handling/exceptions/bad-request.exception'
import { validateAdmin } from '@shared/middlewares/valiadateAdmin'
import { authenticate } from '@shared/middlewares/authenticate'

export class CastController {
  private readonly castRouter: Router
  constructor(private readonly service: CastService) {
    this.castRouter = Router()
    this.initializeCastRoutes()
  }

  private initializeCastRoutes(): void {
    this.castRouter.get('/', this.getAllCasts)
    this.castRouter.post(
      '/',
      authenticate,
      validateAdmin,
      upload.single('actor_url'),
      (req, _res, next) => {
        if (!req.body.actor_url && !req.file) {
          return next(new BadRequestException('Actor url harus diisi'))
        }
        req.body.actor_url = req.file
        next()
      },
      this.createCast
    )
    this.castRouter.patch(
      '/:id',
      authenticate,
      validateAdmin,
      upload.single('actor_url'),
      this.updateCast
    )
    this.castRouter.delete('/:id', authenticate, validateAdmin, this.deleteCast)
  }

  private createCast = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const castCreatePayloadRequest: CastPayload = {
        ...req.body,
        movie_id: parseInt(req.body.movie_id)
      }

      const cast = await this.service.createCast(castCreatePayloadRequest)
      res.status(201).json({ success: true, message: 'Cast berhasil dibuat', data: cast })
    } catch (e) {
      next(e)
    }
  }

  private updateCast = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const castUpdatePayloadRequest: CastPayloadUpdate = {
        ...req.body,
        ...(req.file && { actor_url: req.file })
      }

      const cast = await this.service.updateCast(Number(req.params.id), castUpdatePayloadRequest)
      res.status(201).json({ success: true, message: 'Cast berhasil diupdate', data: cast })
    } catch (e) {
      next(e)
    }
  }

  private deleteCast = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteCast(Number(req.params.id))
      res.status(201).json({ success: true, message: 'Cast berhasil dihapus' })
    } catch (e) {
      next(e)
    }
  }

  private getAllCasts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const casts = await this.service.getAllCasts()
      res.status(200).json({ success: true, message: 'Data cast berhasil didapatkan', data: casts })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.castRouter
  }
}
