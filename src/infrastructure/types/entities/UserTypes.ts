import { Prisma, User } from '@prisma/client'

export type UserJwtPayload = {
  id: number
  name: string
  email: string
  role: string
  iat: string
  exp: string
}

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
  }
}>

export interface IUserRepository {
  getAllUsers(page: number, limit: number, name?: string): Promise<{ users: User[]; total: number }>
  getUserById(id: number): Promise<UserWithRelations>
  createUser(data: UserPayload): Promise<User>
  updateUser(id: number, data: UserUpdatePayload): Promise<User>
  deleteUser(id: number): Promise<void>
}
