import { Prisma, Studio, StudioGallery } from '@prisma/client'

export type CustomFile = {
  photos: Express.Multer.File[]
}

export type StudioWIthGalleriesAndSeats = Prisma.StudioGetPayload<{
  include: {
    galleries: true
    seats: true
  }
}>

export interface IStudioRepository {
  createStudio(studioData: { id: string; name: string; screen_placement: string }): Promise<Studio>
  getAllStudios(): Promise<Studio[]>
  getStudioById(studioId: string): Promise<StudioWIthGalleriesAndSeats>
  updateStudio(
    studioId: string,
    studioData: { id?: string; name?: string; screen_placement?: string }
  ): Promise<Studio>
  deleteStudio(studioId: string): Promise<void>
  uploadStudioPhotos(studioId: string, photos: Express.Multer.File[]): Promise<void>
  deletePhotoFromImageKit(photoId: number): Promise<void>
  getAllPhotos(): Promise<StudioGallery[]>
}
