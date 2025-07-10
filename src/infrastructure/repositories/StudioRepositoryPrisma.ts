import { PrismaClient, ScreenPlacement, Studio, StudioGallery } from '@prisma/client'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { checkExists } from '../../shared/helpers/checkExistingRow'
import { BadRequestException } from '../../shared/error-handling/exceptions/bad-request.exception'
import { uploadImageToImageKit, deleteImageFromImageKit } from '../../shared/utils/imagekit.config'
import { IStudioRepository, StudioWIthGalleriesAndSeats } from '../types/entities/StudioTypes'

export class StudioRepositoryPrisma implements IStudioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createStudio(studioData: { name: string; screen_placement: string }): Promise<Studio> {
    return await this.prisma.studio.create({
      data: {
        ...studioData,
        screen_placement: studioData.screen_placement as ScreenPlacement
      }
    })
  }

  async getAllStudios(): Promise<Studio[]> {
    return await this.prisma.studio.findMany()
  }

  async getStudioById(studioId: number): Promise<StudioWIthGalleriesAndSeats> {
    const studio = await this.prisma.studio.findUnique({
      where: { id: studioId },
      include: { galleries: true, seats: true }
    })
    if (!studio) {
      throw new NotFoundException(`Studio dengan id ${studioId} tidak ditemukan`)
    }
    return studio
  }

  async updateStudio(
    studioId: number,
    studioData: { name?: string; screen_placement?: string }
  ): Promise<Studio> {
    const studio = await this.prisma.studio.findUnique({ where: { id: studioId } })
    if (!studio) {
      throw new NotFoundException(`Studio dengan id ${studioId} tidak ditemukan`)
    }
    return await this.prisma.studio.update({
      where: { id: studioId },
      data: {
        ...(studioData.name && { name: studioData.name }),
        ...(studioData.screen_placement && {
          screen_placement: studioData.screen_placement as ScreenPlacement
        })
      }
    })
  }

  async deleteStudio(studioId: number): Promise<void> {
    await checkExists(this.prisma.studio, studioId, 'Studio')
    await this.prisma.studio.delete({ where: { id: studioId } })
  }

  async uploadStudioPhotos(studioId: number, photos: Express.Multer.File[]): Promise<void> {
    await checkExists(this.prisma.studio, studioId, 'Studio')
    if (!photos || photos.length === 0) {
      throw new BadRequestException('Tidak ada foto yang diupload')
    }

    const urlUploadResult: { url: string; photo_id: string }[] = []
    for (const photo of photos) {
      const { url: result, fileId } = await uploadImageToImageKit(
        'studio',
        '/studioGalleries',
        photo
      )
      urlUploadResult.push({ url: result, photo_id: fileId })
    }

    await this.prisma.$transaction(
      urlUploadResult.map((result) =>
        this.prisma.studioGallery.create({
          data: {
            studio_id: studioId,
            photo_id: result.photo_id,
            photo_url: result.url
          }
        })
      )
    )
  }

  async deletePhotoFromImageKit(photoId: number): Promise<void> {
    const photo = await this.prisma.studioGallery.findUnique({ where: { id: photoId } })
    if (!photo) {
      throw new NotFoundException(`Foto dengan id ${photoId} tidak ditemukan`)
    }
    await this.prisma.studioGallery.delete({ where: { id: photoId } })
    await deleteImageFromImageKit(photo.photo_id)
  }

  async getAllPhotos(): Promise<StudioGallery[]> {
    const photos = await this.prisma.studioGallery.findMany()
    return photos
  }
}
