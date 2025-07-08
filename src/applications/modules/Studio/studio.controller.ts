import { Request, Response, NextFunction, Router } from 'express'
import { StudioService } from './studio.service'

export class StudioController {
  private readonly studioRouter: Router
  constructor(private readonly service: StudioService) {
    this.studioRouter = Router()
    this.initializeStudioRoutes()
  }

  private initializeStudioRoutes(): void {
    this.studioRouter.get('/', this.getAllStudios)
    this.studioRouter.post('/', this.createStudio)
    this.studioRouter.get('/:id', this.getStudioById)
    this.studioRouter.put('/:id', this.updateStudio)
    this.studioRouter.delete('/:id', this.deleteStudio)
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
      const studio = await this.service.getStudioById(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Studio berhasil diambil', data: studio })
    } catch (e) {
      next(e)
    }
  }

  private createStudio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studioCreatePayloadRequest: { name: string } = req.body
      const studio = await this.service.createStudio(studioCreatePayloadRequest)
      res.status(201).json({ success: true, message: 'Studio berhasil dibuat', data: studio })
    } catch (e) {
      next(e)
    }
  }

  private updateStudio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studioUpdatePayloadRequest: { name: string } = req.body
      const studio = await this.service.updateStudio(
        parseInt(req.params.id),
        studioUpdatePayloadRequest
      )
      res.status(200).json({ success: true, message: 'Studio berhasil diupdate', data: studio })
    } catch (e) {
      next(e)
    }
  }

  private deleteStudio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteStudio(parseInt(req.params.id))
      res.status(200).json({ success: true, message: 'Studio berhasil dihapus' })
    } catch (e) {
      next(e)
    }
  }

  public getRoutes(): Router {
    return this.studioRouter
  }
}
