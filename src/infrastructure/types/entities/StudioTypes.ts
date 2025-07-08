import { Prisma } from '@prisma/client'

export type CustomFile = {
  photos: Express.Multer.File[]
}

export type StudioWIthGalleries = Prisma.StudioGetPayload<{
  include: {
    galleries: true
  }
}>
