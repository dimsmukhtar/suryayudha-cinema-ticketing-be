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
  createStudio(studioData: { name: string }): Promise<Studio>
  getAllStudios(): Promise<Studio[]>
  getStudioById(studioId: number): Promise<StudioWIthGalleriesAndSeats>
  updateStudio(studioId: number, studioData: { name: string }): Promise<Studio>
  deleteStudio(studioId: number): Promise<void>
  uploadStudioPhotos(studioId: number, photos: Express.Multer.File[]): Promise<void>
  deletePhotoFromImageKit(photoId: number): Promise<void>
  getAllPhotos(): Promise<StudioGallery[]>
}
