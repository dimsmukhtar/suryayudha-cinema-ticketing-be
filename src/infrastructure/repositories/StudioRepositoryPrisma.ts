import { PrismaClient, Studio } from '@prisma/client'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { checkExists } from '../../shared/helpers/checkExistingRow'

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
}
