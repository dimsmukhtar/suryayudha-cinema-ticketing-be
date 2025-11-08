import { Request, Response, NextFunction, Router } from 'express'
import { StudioService } from './studio.service'
import { uploadMultiple } from '../../../infrastructure/config/multer.config'
import { authenticate } from '../../../shared/middlewares/authenticate'
import { validateAdmin } from '../../../shared/middlewares/valiadateAdmin'

export class StudioController {
  private readonly studioRouter: Router
  constructor(private readonly service: StudioService) {
    this.studioRouter = Router()
    this.initializeStudioRoutes()
  }

  private initializeStudioRoutes(): void {
    this.studioRouter.get('/', this.getAllStudios)
    this.studioRouter.get('/photos', this.getAllPhotos)
    this.studioRouter.post('/', authenticate, validateAdmin, this.createStudio)
    this.studioRouter.get('/:id', this.getStudioById)
    this.studioRouter.put('/:id', authenticate, validateAdmin, this.updateStudio)
    this.studioRouter.delete('/:id', authenticate, validateAdmin, this.deleteStudio)
    this.studioRouter.post(
      '/:id/upload',
      authenticate,
      validateAdmin,
      uploadMultiple.array('photos'),
      this.uploadStudioPhotos
    )
    this.studioRouter.delete(
      '/photos/:id/delete',
      authenticate,
      validateAdmin,
      this.deletePhotoFromImageKit
    )
  }

  private getAllStudios = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studios = await this.service.getAllStudios()
      res
        .status(200)
        .json({ success: true, message: 'Semua studio berhasil diambil', data: studios })
    } catch (e) {
      next(e)
    }
  }

  private getStudioById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studio = await this.service.getStudioById(req.params.id)
      res.status(200).json({ success: true, message: 'Studio berhasil diambil', data: studio })
    } catch (e) {
      next(e)
    }
  }

  private createStudio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studioCreatePayloadRequest: { id: string; name: string; screen_placement: string } =
        req.body
      const studio = await this.service.createStudio(studioCreatePayloadRequest)
      res.status(201).json({ success: true, message: 'Studio berhasil dibuat', data: studio })
    } catch (e) {
      next(e)
    }
  }

  private updateStudio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studioUpdatePayloadRequest: { id?: string; name?: string; screen_placement?: string } =
        req.body
      const studio = await this.service.updateStudio(req.params.id, studioUpdatePayloadRequest)
      res.status(200).json({ success: true, message: 'Studio berhasil diupdate', data: studio })
    } catch (e) {
      next(e)
    }
  }

  private deleteStudio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteStudio(req.params.id)
      res.status(200).json({ success: true, message: 'Studio berhasil dihapus' })
    } catch (e) {
      next(e)
    }
  }

  private uploadStudioPhotos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studioId = req.params.id
      const files = req.files as Express.Multer.File[]
      await this.service.uploadStudioPhotos(studioId, files)
      res.status(200).json({ success: true, message: 'Foto studio berhasil diupload' })
    } catch (e) {
      next(e)
    }
  }

  private deletePhotoFromImageKit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const photoId = parseInt(req.params.id)
      await this.service.deletePhotoFromImageKit(photoId)
      res.status(200).json({ success: true, message: 'Foto studio berhasil dihapus' })
    } catch (e) {
      next(e)
    }
  }

  private getAllPhotos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const photos = await this.service.getAllPhotos()
      res.status(200).json({ success: true, message: 'Semua foto berhasil diambil', data: photos })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.studioRouter
  }
}
