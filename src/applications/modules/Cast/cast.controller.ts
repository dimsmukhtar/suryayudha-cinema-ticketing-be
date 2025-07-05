import { Router, Request, Response, NextFunction } from 'express'
import { CastService } from './cast.service'
import { uploadImageToImageKit } from '../../../shared/utils/imagekit.config'
import { upload } from '../../../shared/utils/multer.config'
import { CastPayload, CastPayloadUpdate } from '../../../infrastructure/types/entities/CastTypes'

export class CastController {
  private readonly castRouter: Router
  constructor(private readonly service: CastService) {
    this.castRouter = Router()
    this.initializeCastRoutes()
  }

  private initializeCastRoutes(): void {
    this.castRouter.post('/', upload.single('actor_url'), this.createCast)
  }

  private createCast = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file
      let actorUrl: string | null = null
      if (file) {
        actorUrl = await uploadImageToImageKit(file)
      }
      const castCreatePayloadRequest: CastPayload = {
        ...req.body,
        movie_id: parseInt(req.body.movie_id),
        actor_url: actorUrl ? actorUrl : req.body.actor_url
      }

      const cast = await this.service.createCast(castCreatePayloadRequest)
      res.status(201).json({ success: true, message: 'Cast berhasil dibuat', data: cast })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.castRouter
  }
}
