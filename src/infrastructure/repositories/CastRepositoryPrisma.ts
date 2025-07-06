import { Cast, PrismaClient } from '@prisma/client'
import { CastPayload, CastPayloadUpdate, ICastRepository } from '../types/entities/CastTypes'
import { checkExists } from '../../shared/helpers/checkExistingRow'
import { uploadImageToImageKit } from '../../shared/utils/imagekit.config'

export class CastRepositoryPrisma implements ICastRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createCast(castData: CastPayload): Promise<Cast> {
    await checkExists(this.prisma.movie, castData.movie_id, 'Film')
    const actorUrl: string = await uploadImageToImageKit(castData.actor_url)
    const castDataWithActorUrl = { ...castData, actor_url: actorUrl }
    return await this.prisma.cast.create({
      data: castDataWithActorUrl
    })
  }

  async updateCast(castId: number, castData: CastPayloadUpdate): Promise<Cast> {
    await checkExists(this.prisma.cast, castId, 'Cast')
    let actorUrlString: string | undefined
    if (castData.actor_url) {
      actorUrlString = await uploadImageToImageKit(castData.actor_url)
    }
    const data: Partial<Cast> = {
      ...('actor_name' in castData && { actor_name: castData.actor_name }),
      ...(actorUrlString && { actor_url: actorUrlString })
    }
    return await this.prisma.cast.update({
      where: {
        id: castId
      },
      data
    })
  }

  async deleteCast(castId: number): Promise<void> {
    await checkExists(this.prisma.cast, castId, 'Cast')
    await this.prisma.cast.delete({
      where: { id: castId }
    })
  }

  async getAllCasts(): Promise<Cast[]> {
    return await this.prisma.cast.findMany()
  }
}
