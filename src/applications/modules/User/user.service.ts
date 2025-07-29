import { User } from '@prisma/client'
import { UserRepositoryPrisma } from '../../../infrastructure/repositories/UserRepositoryPrisma'
import { CustomHandleError } from '../../../shared/error-handling/middleware/custom-handle'
import {
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UserPayload,
  UserUpdatePayload,
  UserWithRelations,
  VerifyEmailQuery
} from 'infrastructure/types/entities/UserTypes'
import { UserValidation } from './user.validation'
import { ZodValidation } from '../../../shared/middlewares/validation.middleware'

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

  async resendVerificationLink(email: string): Promise<void> {
    try {
      await this.repository.resendVerificationLink(email)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengirim email verifikasi'
      })
    }
  }

  async verifyEmail(token: string, email: string): Promise<void> {
    try {
      await this.repository.verifyEmail(token, email)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat verifikasi email'
      })
    }
  }

  async login(role: string, data: LoginPayload): Promise<string> {
    try {
      const userPayloadRequest = ZodValidation.validate(UserValidation.LOGIN, data)
      const token =
        role === 'user'
          ? await this.repository.login(userPayloadRequest)
          : await this.repository.loginAdmin(userPayloadRequest)
      return token
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat login'
      })
    }
  }

  async getProfile(userId: number): Promise<User> {
    try {
      return await this.repository.getProfile(userId)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat mengambil data profile'
      })
    }
  }

  async updateProfile(userId: number, data: UserUpdatePayload): Promise<User> {
    try {
      const userPayloadRequest = ZodValidation.validate(UserValidation.UPDATE_PROFILE, data)
      return await this.repository.updateProfile(userId, userPayloadRequest)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat update profile'
      })
    }
  }

  async changePassword(email: string, data: ChangePasswordPayload): Promise<User> {
    try {
      const changePasswordPayload = ZodValidation.validate(UserValidation.CHANGE_PASSWORD, data)
      return await this.repository.changePassword(email, changePasswordPayload)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat ubah password'
      })
    }
  }

  async sendTokenResetPassword(data: { email: string }): Promise<void> {
    try {
      const forgotPasswordPayload = ZodValidation.validate(UserValidation.FORGOT_PASSWORD, data)
      await this.repository.sendTokenResetPassword(forgotPasswordPayload)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat login'
      })
    }
  }

  async resetPassword(data: ResetPasswordPayload): Promise<User> {
    try {
      const resetPasswordPayload = ZodValidation.validate(UserValidation.RESET_PASSWORD, data)
      return await this.repository.resetPassword(resetPasswordPayload)
    } catch (e) {
      throw CustomHandleError(e, {
        context: 'Error saat reset password'
      })
    }
  }
}
