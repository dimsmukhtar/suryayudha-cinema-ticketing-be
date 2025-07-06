import { User } from '@prisma/client'
import { UserRepositoryPrisma } from '../../../infrastructure/repositories/UserRepositoryPrisma'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import {
  RegisterPayload,
  UserPayload,
  UserUpdatePayload,
  UserWithRelations,
  VerifyEmailPayload
} from 'infrastructure/types/entities/UserTypes'
import { UserValidation } from './user.validation'
import { ZodValidation } from '../../../shared/middlewares/validation.middleware'
import { sendEmail } from '../../../shared/utils/nodemailer'

export class UserService {
  constructor(private readonly repository: UserRepositoryPrisma) {}

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.repository.getAllUsers()
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

  async register(data: RegisterPayload): Promise<User> {
    try {
      const userPayloadRequest = ZodValidation.validate(UserValidation.REGISTER, data)
      return await this.repository.register(userPayloadRequest)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat membuat user'
      })
    }
  }

  async resendVerificationToken(email: string): Promise<void> {
    try {
      await this.repository.resendVerificationToken(email)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengirim email verifikasi'
      })
    }
  }

  async verifyEmail(data: VerifyEmailPayload): Promise<void> {
    try {
      const verifyEmailPayload = ZodValidation.validate(UserValidation.VERIFY_EMAIL, data)
      await this.repository.verifyEmail(verifyEmailPayload)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat verifikasi email'
      })
    }
  }
}
