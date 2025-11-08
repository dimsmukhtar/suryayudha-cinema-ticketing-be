import { User } from '@prisma/client'
import { UserRepositoryPrisma } from '../../../infrastructure/repositories/UserRepositoryPrisma'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import {
  UserPayload,
  UserUpdatePayload,
  UserWithRelations
} from 'infrastructure/types/entities/UserTypes'
import { UserValidation } from './user.validation'
import { ZodValidation } from '../../../shared/middlewares/validation.middleware'

export class UserService {
  constructor(private readonly repository: UserRepositoryPrisma) {}

  async getAllUsers(
    page: number,
    limit: number,
    name?: string
  ): Promise<{ users: User[]; total: number }> {
    try {
      const { users, total } = await this.repository.getAllUsers(page, limit, name)
      return { users, total }
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil semua user'
      })
    }
  }

  async getUserById(id: number): Promise<UserWithRelations> {
    try {
      return await this.repository.getUserById(id)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil user berdasarkan id'
      })
    }
  }

  async createUser(data: UserPayload): Promise<User> {
    try {
      const userPayloadRequest = ZodValidation.validate(UserValidation.CREATE, data)
      return await this.repository.createUser(userPayloadRequest)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat user'
      })
    }
  }

  async updateUser(id: number, data: UserUpdatePayload): Promise<User> {
    try {
      const userPayloadRequest = ZodValidation.validate(UserValidation.UPDATE, data)
      return await this.repository.updateUser(id, userPayloadRequest)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengupdate user'
      })
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.repository.deleteUser(id)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat menghapus user'
      })
    }
  }

  async getTicketsForUser(userId: number) {
    try {
      return await this.repository.getTicketsForUser(userId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil data tiket'
      })
    }
  }
}
