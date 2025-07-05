import { Cast } from '@prisma/client'
import { CastRepositoryPrisma } from '../../../infrastructure/repositories/CastRepositoryPrisma'
import { CastPayload, CastPayloadUpdate } from '../../../infrastructure/types/entities/CastTypes'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import { ZodValidation } from '../../../shared/middlewares/validation.middleware'
import { CastValidation } from './cast.validation'

export class CastService {
  constructor(private readonly repository: CastRepositoryPrisma) {}

  async createCast(castData: CastPayload): Promise<Cast> {
    try {
      const castCreatePayloadRequest = ZodValidation.validate(CastValidation.CREATE, castData)
      return await this.repository.createCast(castCreatePayloadRequest)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat cast'
      })
    }
  }

  async updateCast(castId: number, castData: CastPayloadUpdate): Promise<Cast> {
    try {
      const castUpdatePayloadRequest = ZodValidation.validate(CastValidation.UPDATE, castData)
      return await this.repository.updateCast(castId, castUpdatePayloadRequest)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengupdate cast'
      })
    }
  }

  async deleteCast(castId: number): Promise<void> {
    try {
      await this.repository.deleteCast(castId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengupdate cast'
      })
    }
  }
}
