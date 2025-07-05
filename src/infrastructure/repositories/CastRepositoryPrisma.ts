import { Cast, PrismaClient } from '@prisma/client'
import { CastPayload, CastPayloadUpdate, ICastRepository } from '../types/entities/CastTypes'
import { checkExists } from '../../shared/helpers/checkExistingRow'

export class CastRepositoryPrisma implements ICastRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createCast(castData: CastPayload): Promise<Cast> {
    await checkExists(this.prisma.cast, castData.movie_id, 'Film')
    return await this.prisma.cast.create({
      data: castData
    })
  }

  async updateCast(castId: number, castData: CastPayloadUpdate): Promise<Cast> {
    await checkExists(this.prisma.cast, castId, 'Cast')
    return await this.prisma.cast.update({
      where: {
        id: castId
      },
      data: castData
    })
  }

  async deleteCast(castId: number): Promise<void> {
    await checkExists(this.prisma.cast, castId, 'Cast')
    await this.prisma.cast.delete({
      where: { id: castId }
    })
  }
}
