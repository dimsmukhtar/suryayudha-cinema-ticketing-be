import { PrismaClient, User } from '@prisma/client'
import {
  IUserRepository,
  UserWithRelations,
  UserPayload,
  UserUpdatePayload,
  RegisterPayload
} from '../../infrastructure/types/entities/UserTypes'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { checkExists } from '../../shared/helpers/checkExistingRow'
import { uploadImageToImageKit } from '../../shared/utils/imagekit.config'

//   getAllUsers(): Promise<User>
//   getUserById(id: number): Promise<User>
//   createUser(data: UserPayload): Promise<User>
//   updateUser(id: number, data: UserUpdatePayload): Promise<User>
//   deleteUser(id: number): Promise<void>

//   register(data: RegisterPayload): Promise<User>
//   login(data: LoginPayload): Promise<User>
//   loginAdmin(data: LoginPayload): Promise<User>
//   logout(): Promise<void>
//   verifyEmail(data: VerifyEmailPayload): Promise<User>
//   profile(): Promise<User>
//   updateProfile(data: ProfileUpdatePayload): Promise<User>
//   changePassword(data: ChangePasswordPayload): Promise<User>
//   forgotPassword(email: string): Promise<void>
//   resetPassword(data: ResetPasswordPayload): Promise<User>

export class UserRepositoryPrisma {
  constructor(private readonly prisma: PrismaClient) {}

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async getUserById(id: number): Promise<UserWithRelations> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        transactions: true,
        notifications: true
      }
    })
    if (!user) {
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`)
    }
    return user
  }

  async createUser(data: UserPayload): Promise<User> {
    return await this.prisma.user.create({ data })
  }

  async updateUser(id: number, data: UserUpdatePayload): Promise<User> {
    await checkExists(this.prisma.user, id, 'User')
    let profileUrl: string | undefined
    if (data.profile_url) {
      profileUrl = await uploadImageToImageKit(data.profile_url)
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

  async register(data: RegisterPayload): Promise<User> {
    const { passwordConfirmation, ...prismaData } = data
    return await this.prisma.user.create({ data: prismaData })
  }
}
