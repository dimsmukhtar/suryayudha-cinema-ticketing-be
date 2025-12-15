import { Prisma, User } from '@prisma/client'

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
  email: string
  passwordResetCode: string
  newPassword: string
  newPasswordConfirmation: string
}

export type VerifyEmailQuery = {
  token: string
  email: string
}

export type ProfileUpdatePayload = {
  name?: string
  email?: string
  profile_url?: Express.Multer.File
}

export type ForgotPasswordPayload = {
  email: string
}

export interface IAuthRepository {
  register(data: RegisterPayload): Promise<User>
  resendVerificationLink(email: string): Promise<void>
  verifyEmail(token: string, email: string): Promise<void>
  login(data: LoginPayload): Promise<{ accessToken: string; refreshToken: string }>
  loginAdmin(data: LoginPayload): Promise<{ accessToken: string; refreshToken: string }>
  refreshToken(refreshToken: string): Promise<{ newAccessToken: string; newRefreshToken: string }>
  getProfile(userId: number): Promise<User>
  updateProfile(userId: number, data: ProfileUpdatePayload): Promise<User>
  changePassword(email: string, data: ChangePasswordPayload): Promise<User>
  sendTokenResetPassword(email: { email: string }): Promise<void>
  resetPassword(data: ResetPasswordPayload): Promise<User>
}
