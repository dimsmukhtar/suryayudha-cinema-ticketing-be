import { Prisma, User } from '@prisma/client'

export type UserPayload = {
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  is_verified: boolean
}

export type UserUpdatePayload = {
  name?: string
  email?: string
  password?: string
  role?: 'user' | 'admin'
  profile_url?: Express.Multer.File
  is_verified?: boolean
}

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    transactions: true
    notifications: true
  }
}>
export type RegisterPayload = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  role: 'user' | 'admin'
  is_verified: boolean
  profile_url?: string
  verification_token?: string
  verification_token_expires_at?: Date
}

export type LoginPayload = {
  email: string
  password: string
}

export type ChangePasswordPayload = {
  oldPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export type ResetPasswordPayload = {
  passwordResetCode: string
  newPassword: string
  newPasswordConfirmation: string
}

export type VerifyEmailPayload = {
  email: string
  verification_token: string
}

export type ProfileUpdatePayload = {
  name?: string
  email?: string
  profile_url?: string
}

export interface IUserRepository {
  getAllUsers(): Promise<User[]>
  getUserById(id: number): Promise<User>
  createUser(data: UserPayload): Promise<User>
  updateUser(id: number, data: UserUpdatePayload): Promise<User>
  deleteUser(id: number): Promise<void>

  register(data: RegisterPayload): Promise<User>
  login(data: LoginPayload): Promise<User>
  loginAdmin(data: LoginPayload): Promise<User>
  logout(): Promise<void>
  resendVerificationToken(email: string): Promise<void>
  verifyEmail(data: VerifyEmailPayload): Promise<void>
  profile(): Promise<User>
  updateProfile(data: ProfileUpdatePayload): Promise<User>
  changePassword(data: ChangePasswordPayload): Promise<User>
  forgotPassword(email: string): Promise<void>
  resetPassword(data: ResetPasswordPayload): Promise<User>
}
