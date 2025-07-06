import { Cast } from '@prisma/client'

export type CastPayload = {
  actor_name: string
  actor_url: Express.Multer.File
  movie_id: number
}

export type CastPayloadUpdate = Partial<CastPayload>

export interface ICastRepository {
  createCast(castData: CastPayload): Promise<Cast>
  updateCast(castId: number, castData: CastPayloadUpdate): Promise<Cast>
  deleteCast(castId: number): Promise<void>
}
