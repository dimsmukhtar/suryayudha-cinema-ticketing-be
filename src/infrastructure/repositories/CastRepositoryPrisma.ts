import { Cast, PrismaClient } from '@prisma/client'
import { CastPayload, CastPayloadUpdate, ICastRepository } from '../types/entities/CastTypes'
import { checkExists } from '@shared/helpers/checkExistingRow'
import { uploadImageToImageKit } from '../config/imagekit.config'

export class CastRepositoryPrisma implements ICastRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createCast(castData: CastPayload): Promise<Cast> {
    await checkExists(this.prisma.movie, castData.movie_id, 'Film')
    const { url: actorUrl } = await uploadImageToImageKit('actor', '/casts', castData.actor_url)
    const castDataWithActorUrl = { ...castData, actor_url: actorUrl }
    return await this.prisma.cast.create({
      data: castDataWithActorUrl
    })
  }

  async updateCast(castId: number, castData: CastPayloadUpdate): Promise<Cast> {
    await checkExists(this.prisma.cast, castId, 'Cast')
    let actorUrlString: string | undefined
    if (castData.actor_url && typeof castData.actor_url !== 'string') {
      const { url } = await uploadImageToImageKit('actor', '/casts', castData.actor_url)
      actorUrlString = url
    }
    const data: Partial<Cast> = {}

    if (castData.actor_name) {
      data.actor_name = castData.actor_name
    }

    if (actorUrlString) {
      data.actor_url = actorUrlString
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
