import { Studio, StudioGallery } from '@prisma/client'
import { StudioRepositoryPrisma } from '../../../infrastructure/repositories/StudioRepositoryPrisma'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import { ZodValidation } from '../../../shared/middlewares/validation.middleware'
import { StudioValidation } from './studio.validation'
import { StudioWIthGalleriesAndSeats } from '../../../infrastructure/types/entities/StudioTypes'

export class StudioService {
  constructor(private readonly repository: StudioRepositoryPrisma) {}

  async createStudio(studioData: { name: string; screen_placement: string }): Promise<Studio> {
    try {
      const studioPayloadRequest = ZodValidation.validate(StudioValidation.CREATE, studioData)
      return await this.repository.createStudio(studioPayloadRequest)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat studio'
      })
    }
  }

  async getAllStudios(): Promise<Studio[]> {
    try {
      return await this.repository.getAllStudios()
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil semua studio'
      })
    }
  }

  async getStudioById(studioId: number): Promise<StudioWIthGalleriesAndSeats> {
    try {
      return await this.repository.getStudioById(studioId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil studio berdasarkan id'
      })
    }
  }

  async updateStudio(
    studioId: number,
    studioData: { name?: string; screen_placement?: string }
  ): Promise<Studio> {
    try {
      const studioPayloadRequest = ZodValidation.validate(StudioValidation.UPDATE, studioData)
      return await this.repository.updateStudio(studioId, studioPayloadRequest)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengubah studio'
      })
    }
  }

  async deleteStudio(studioId: number): Promise<void> {
    try {
      return await this.repository.deleteStudio(studioId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat menghapus studio'
      })
    }
  }

  async uploadStudioPhotos(studioId: number, photos: Express.Multer.File[]): Promise<void> {
    try {
      return await this.repository.uploadStudioPhotos(studioId, photos)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengupload foto studio'
      })
    }
  }

  async deletePhotoFromImageKit(photoId: number): Promise<void> {
    try {
      return await this.repository.deletePhotoFromImageKit(photoId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat menghapus foto studio'
      })
    }
  }

  async getAllPhotos(): Promise<StudioGallery[]> {
    try {
      return await this.repository.getAllPhotos()
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil semua foto studio'
      })
    }
  }
}
