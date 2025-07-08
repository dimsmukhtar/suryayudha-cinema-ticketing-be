import { PrismaClient, Studio, StudioGallery } from '@prisma/client'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { checkExists } from '../../shared/helpers/checkExistingRow'
import { BadRequestException } from '../../shared/error-handling/exceptions/bad-request.exception'
import { uploadImageToImageKit } from '../../shared/utils/imagekit.config'

export class StudioRepositoryPrisma {
  constructor(private readonly prisma: PrismaClient) {}

  async createStudio(studioData: { name: string }): Promise<Studio> {
    return await this.prisma.studio.create({
      data: studioData
    })
  }

  async getAllStudios(): Promise<Studio[]> {
    return await this.prisma.studio.findMany()
  }

  async getStudioById(studioId: number): Promise<Studio> {
    const studio = await this.prisma.studio.findUnique({ where: { id: studioId } })
    if (!studio) {
      throw new NotFoundException(`Studio dengan id ${studioId} tidak ditemukan`)
    }
    return studio
  }

  async updateStudio(studioId: number, studioData: { name: string }): Promise<Studio> {
    await checkExists(this.prisma.studio, studioId, 'Studio')
    return await this.prisma.studio.update({
      where: { id: studioId },
      data: studioData
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

    const urlUploadResult: { url: string }[] = []
    for (const photo of photos) {
      const result = await uploadImageToImageKit('studio', '/studioGalleries', photo)
      urlUploadResult.push({ url: result })
    }

    await this.prisma.$transaction(
      urlUploadResult.map((result) =>
        this.prisma.studioGallery.create({
          data: {
            studio_id: studioId,
            photo_url: result.url
          }
        })
      )
    )
  }
}
