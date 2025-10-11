import { Prisma, PrismaClient, TransactionStatus, User } from '@prisma/client'
import {
  IUserRepository,
  UserWithRelations,
  UserPayload,
  UserUpdatePayload,
  RegisterPayload,
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
import { verificationEmailTemplate } from '../../shared/helpers/emailTemplate'

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

  async register(data: RegisterPayload): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (user) {
      throw new BadRequestException(`Email ${data.email} sudah terdaftar`)
    }
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${data.verification_token}&email=${data.email}`
    const emailHtml = verificationEmailTemplate
      .replace('{{namaUser}}', data.name)
      .replace('{{verificationLink}}', verificationLink)
    await sendEmail({
      email: data.email,
      subject: 'Verifikasi Akun Surya Yudha Cinema Anda',
      html: emailHtml
    })
    const { passwordConfirmation, ...prismaData } = data

    return await this.prisma.user.create({
      data: {
        ...prismaData,
        password: await hashPassword(data.password)
      }
    })
  }

  async resendVerificationLink(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new NotFoundException(`User dengan email ${email} tidak ditemukan`)
    }
    const verificationToken = generateVerificationToken()
    const verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000)
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${email}`
    const emailHtml = verificationEmailTemplate
      .replace('{{namaUser}}', email)
      .replace('{{verificationLink}}', verificationLink)
    await sendEmail({
      email: email,
      subject: 'Link Verifikasi Akun Baru Anda',
      html: emailHtml
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

  async verifyEmail(token: string, email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (!user) {
      throw new NotFoundException(`User dengan email ${email} tidak ditemukan`)
    }
    if (user.verification_token !== token) {
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
        email: email
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
      { expiresIn: '60m' } // best pratice use 15 minutes with refresh token, but now i dont have refresh token yet, so i set 60 minutes
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
      { expiresIn: '60m' } // best pratice use 15 minutes with refresh token, but now i dont have refresh token yet, so i set 60 minutes
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
      const { url } = await uploadImageToImageKit('profile', '/users', data.profile_url)
      profileUrl = url
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

  async getDashboardStats() {
    const [totalRevenue, totalTicketsSold, totalMovies, totalUsers, recentTransactions] =
      await Promise.all([
        this.prisma.transaction.aggregate({
          _sum: {
            final_amount: true
          },
          where: {
            status: TransactionStatus.settlement
          }
        }),
        this.prisma.ticket.count(),

        this.prisma.movie.count(),

        this.prisma.user.count({ where: { role: 'user' } }),

        this.prisma.transaction.findMany({
          where: {
            status: TransactionStatus.settlement
          },
          take: 5,
          orderBy: {
            updated_at: 'desc'
          },
          include: {
            user: { select: { name: true, email: true } }
          }
        })
      ])

    return {
      totalRevenue: totalRevenue._sum.final_amount || 0,
      totalTicketsSold,
      totalMovies,
      totalUsers,
      recentTransactions
    }
  }

  async getRevenueChartData(
    startDate: Date,
    endDate: Date
  ): Promise<{ date: string; revenue: number }[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        status: 'settlement',
        updated_at: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        final_amount: true,
        updated_at: true
      }
    })

    const dailyRevenue = new Map<string, number>()

    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0]
      dailyRevenue.set(dateString, 0)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    transactions.forEach((trx) => {
      const dateString = trx.updated_at!.toISOString().split('T')[0]
      const currentRevenue = dailyRevenue.get(dateString) || 0
      dailyRevenue.set(dateString, currentRevenue + trx.final_amount)
    })

    const chartData = Array.from(dailyRevenue.entries())
      .map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        revenue
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return chartData
  }
}
