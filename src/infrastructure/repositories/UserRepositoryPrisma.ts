import { Prisma, PrismaClient, User } from '@prisma/client'
import {
  IUserRepository,
  UserWithRelations,
  UserPayload,
  UserUpdatePayload
} from '../../infrastructure/types/entities/UserTypes'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { checkExists } from '../../shared/helpers/checkExistingRow'
import { uploadImageToImageKit } from '../config/imagekit.config'
import { BadRequestException } from '../../shared/error-handling/exceptions/bad-request.exception'

import { hashPassword } from '../../shared/helpers/passwordEncrypt'

export class UserRepositoryPrisma implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAllUsers(
    page: number,
    limit: number,
    name?: string
  ): Promise<{ users: User[]; total: number }> {
    const where: Prisma.UserWhereInput = {}
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive'
      }
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          created_at: 'desc'
        }
      }),
      this.prisma.user.count({ where })
    ])

    return { users, total }
  }

  async getUserById(id: number): Promise<UserWithRelations> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        transactions: true
      }
    })
    if (!user) {
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`)
    }
    return user
  }

  async getTicketsForUser(userId: number): Promise<any> {
    const allMyTickets = this.prisma.ticket.findMany({
      where: {
        transaction_item: {
          transaction: {
            user_id: userId
          }
        }
      },
      include: {
        transaction_item: {
          include: {
            schedule_seat: {
              include: {
                schedule: {
                  include: {
                    movie: {
                      select: {
                        title: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    const customedTickets = (await allMyTickets).map((ticket) => ({
      id: ticket.id,
      code: ticket.code,
      movie_title: ticket.transaction_item.schedule_seat.schedule.movie.title,
      seat_label: ticket.transaction_item.seat_label
    }))
    return customedTickets
  }

  async createUser(data: UserPayload): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (user) {
      throw new BadRequestException(`Email ${data.email} sudah terdaftar`)
    }
    return await this.prisma.user.create({
      data: {
        ...data,
        password: await hashPassword(data.password)
      }
    })
  }

  async updateUser(id: number, data: UserUpdatePayload): Promise<User> {
    await checkExists(this.prisma.user, id, 'User')
    let profileUrl: string | undefined
    if (data.profile_url && typeof data.profile_url !== 'string') {
      const { url } = await uploadImageToImageKit('profile', '/users', data.profile_url)
      profileUrl = url
    }
    const dataUpdata: any = {
      ...data,
      ...(profileUrl && { profile_url: profileUrl })
    }
    return await this.prisma.user.update({ where: { id }, data: dataUpdata })
  }

  async deleteUser(id: number): Promise<void> {
    await checkExists(this.prisma.user, id, 'User')
    await this.prisma.user.delete({ where: { id } })
  }
}
