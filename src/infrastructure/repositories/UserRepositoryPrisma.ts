import { PrismaClient, User } from '@prisma/client'
import {
  IUserRepository,
  UserWithRelations,
  UserPayload,
  UserUpdatePayload,
  RegisterPayload,
  VerifyEmailPayload,
  LoginPayload,
  ProfileUpdatePayload,
  ChangePasswordPayload,
  ResetPasswordPayload
} from '../../infrastructure/types/entities/UserTypes'
import { NotFoundException } from '../../shared/error-handling/exceptions/not-found.exception'
import { checkExists } from '../../shared/helpers/checkExistingRow'
import { uploadImageToImageKit } from '../../shared/utils/imagekit.config'
import { BadRequestException } from '../../shared/error-handling/exceptions/bad-request.exception'
import { sendEmail } from '../../shared/utils/nodemailer'
import { generateVerificationToken } from '../../shared/helpers/generateVerificationToken'
import { hashPassword, verifyPassword } from '../../shared/utils/passwordEncrypt'
import { signJwt } from '../../shared/utils/jwt'

export class UserRepositoryPrisma {
  constructor(private readonly prisma: PrismaClient) {}

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany()
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
    const user = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (user) {
      throw new BadRequestException(`Email ${data.email} sudah terdaftar`)
    }
    await sendEmail({
      email: data.email,
      subject: 'Token untuk Verifikasi Email Anda',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body
  style="
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  "
>
  <div
    style="
      background: linear-gradient(to right, #5f6fff, #5f6fff);
      padding: 20px;
      text-align: center;
    "
  >
    <h1 style="color: white; margin: 0">Verifikasi Email Anda</h1>
  </div>
  <div
    style="
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    "
  >
    <p>Hallo</p>
    <p>
      Terimakasih sudah mendaftarkan diri anda di Website Surya Yudha Cinema, berikut adalah kode
      verifikasi anda!.
    </p>
    <div style="text-align: center; margin: 30px 0">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #5f6fff"
        >${data.verification_token}</span
      >
    </div>
    <p>Gunakan kode diatas untuk memverifikasi akun anda.</p>
    <p>
      Kode ini akan kedaluwarsa dalam 15 menit demi alasan keamanan, jadi pastikan anda verifikasi
      sebelum 15 menit!..
    </p>
    <p>Best regards,<br />Developer Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em">
    <p>Jika Anda tidak membuat akun dengan kami, harap abaikan email ini.</p>
  </div>
</body>
</html>
,
`
    })
    const { passwordConfirmation, ...prismaData } = data

    return await this.prisma.user.create({
      data: {
        ...prismaData,
        password: await hashPassword(data.password)
      }
    })
  }

  async resendVerificationToken(email: string): Promise<void> {
    const verificationToken = generateVerificationToken()
    const verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000)
    await sendEmail({
      email: email,
      subject: 'Token untuk Verifikasi Email Anda',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body
  style="
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  "
>
  <div
    style="
      background: linear-gradient(to right, #5f6fff, #5f6fff);
      padding: 20px;
      text-align: center;
    "
  >
    <h1 style="color: white; margin: 0">Verifikasi Email Anda</h1>
  </div>
  <div
    style="
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    "
  >
    <p>Hallo</p>
    <p>
      Terimakasih sudah mendaftarkan diri anda di Website Surya Yudha Cinema, berikut adalah kode
      verifikasi anda!.
    </p>
    <div style="text-align: center; margin: 30px 0">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #5f6fff"
        >${verificationToken}</span
      >
    </div>
    <p>Gunakan kode diatas untuk memverifikasi akun anda.</p>
    <p>
      Kode ini akan kedaluwarsa dalam 15 menit demi alasan keamanan, jadi pastikan anda verifikasi
      sebelum 15 menit!..
    </p>
    <p>Best regards,<br />Developer Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em">
    <p>Jika Anda tidak membuat akun dengan kami, harap abaikan email ini.</p>
  </div>
</body>
</html>
,
`
    })
    await this.prisma.user.update({
      where: {
        email
      },
      data: {
        verification_token: verificationToken,
        verification_token_expires_at: verificationTokenExpiresAt
      }
    })
  }

  async verifyEmail(data: VerifyEmailPayload): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email
      }
    })
    if (!user) {
      throw new NotFoundException(`User dengan email ${data.email} tidak ditemukan`)
    }
    if (user.verification_token !== data.verification_token) {
      throw new BadRequestException('Token verifikasi salah')
    }

    if (user.is_verified) {
      throw new BadRequestException('Email sudah terverifikasi')
    }

    if (user.verification_token_expires_at! < new Date()) {
      throw new BadRequestException('Token verifikasi sudah kadaluarsa')
    }
    await this.prisma.user.update({
      where: {
        email: data.email
      },
      data: {
        is_verified: true
      }
    })
  }

  async login(data: LoginPayload): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (!user) {
      throw new NotFoundException(`User dengan email ${data.email} tidak ditemukan`)
    }
    if (user.role !== 'user') {
      throw new BadRequestException('Login ini hanya untuk user')
    }
    const isPasswordValid = await verifyPassword(user.password, data.password)
    if (!isPasswordValid) {
      throw new BadRequestException('Password salah')
    }
    const token = signJwt(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      'ACCESS_TOKEN_PRIVATE_KEY',
      { expiresIn: '15m' }
    )
    return token
  }
  async loginAdmin(data: LoginPayload): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (!user) {
      throw new NotFoundException(`User dengan email ${data.email} tidak ditemukan`)
    }
    if (user.role !== 'admin') {
      throw new BadRequestException('Login ini hanya untuk admin')
    }
    const isPasswordValid = await verifyPassword(user.password, data.password)
    if (!isPasswordValid) {
      throw new BadRequestException('Password salah')
    }
    const token = signJwt(
      { id: user.id, email: user.email, role: user.role },
      'ACCESS_TOKEN_PRIVATE_KEY',
      { expiresIn: '15m' }
    )
    return token
  }

  async getProfile(userId: number): Promise<User> {
    const findUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!findUser) {
      throw new NotFoundException(`User dengan id ${userId} tidak ditemukan`)
    }
    return findUser
  }

  async updateProfile(userId: number, data: ProfileUpdatePayload): Promise<User> {
    await checkExists(this.prisma.user, userId, 'User')
    let profileUrl: string | undefined
    if (data.profile_url) {
      profileUrl = await uploadImageToImageKit(data.profile_url)
    }
    const dataUpdata: any = {
      ...data,
      ...(profileUrl && { profile_url: profileUrl })
    }
    return await this.prisma.user.update({ where: { id: userId }, data: dataUpdata })
  }

  async changePassword(email: string, data: ChangePasswordPayload): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new NotFoundException(`User dengan email ${email} tidak ditemukan`)
    }
    const isPasswordValid = await verifyPassword(user.password, data.oldPassword)
    if (!isPasswordValid) {
      throw new BadRequestException('Password lama salah')
    }
    const hash = await hashPassword(data.newPassword)
    return await this.prisma.user.update({
      where: { email },
      data: { password: hash }
    })
  }

  async sendTokenResetPassword(email: { email: string }): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email: email.email } })
    if (!user) {
      throw new NotFoundException(`User dengan email ${email.email} tidak ditemukan`)
    }
    const resetPasswordToken = generateVerificationToken()
    const resetPasswordTokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000)
    await sendEmail({
      email: email.email,
      subject: 'Reset Password Token untuk reset password Anda',
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Token Reset Password</title>
        </head>
        <body
          style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          "
        >
          <div
            style="
              background: linear-gradient(to right, #5f6fff, #5f6fff);
              padding: 20px;
              text-align: center;
            "
          >
            <h1 style="color: white; margin: 0">Token Reset Password</h1>
          </div>
          <div
            style="
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 0 0 5px 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            "
          >
            <p>Hallo</p>
            <p>Terimakasih atas kepercayaan anda untuk menggunakan layanan kami.</p>
            <div style="text-align: center; margin: 30px 0">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #5f6fff"
                >${resetPasswordToken}</span
              >
            </div>
            <p>Gunakan kode diatas untuk mereset password akun anda.</p>
            <p>
              Kode ini akan kedaluwarsa dalam 5 menit demi alasan keamanan, jadi pastikan anda verifikasi
              sebelum 5 menit!..
            </p>
            <p>Best regards,<br />Developer Team</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em">
            <p>Jika Anda tidak membuat akun dengan kami, harap abaikan email ini.</p>
          </div>
        </body>
      </html>
      , `
    })

    await this.prisma.user.update({
      where: { email: email.email },
      data: {
        reset_password_token: resetPasswordToken,
        reset_password_token_expires_at: resetPasswordTokenExpiresAt
      }
    })
  }

  async resetPassword(data: ResetPasswordPayload): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (!user) {
      throw new NotFoundException(`User dengan email ${data.email} tidak ditemukan`)
    }
    if (data.passwordResetCode !== user.reset_password_token) {
      throw new BadRequestException('Token reset password salah')
    }
    if (user.reset_password_token_expires_at! < new Date()) {
      throw new BadRequestException('Token reset password sudah kadaluarsa')
    }

    const hash = await hashPassword(data.newPassword)
    return await this.prisma.user.update({
      where: { email: data.email },
      data: { password: hash, reset_password_token: null, reset_password_token_expires_at: null }
    })
  }
}
