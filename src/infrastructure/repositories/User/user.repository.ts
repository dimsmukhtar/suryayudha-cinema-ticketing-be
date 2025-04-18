// import { prisma } from '@/infrastructure/database/client'
// import { User } from '@/infrastructure/database/generated/prisma/client'
// import { IUserRepository } from '@/infrastructure/repositories/user/user.repository.interface'

// export class UserRepository {
//   async create(userData: Partial<User>): Promise<User> {
//     return prisma.user.create({
//       data: userData
//     })
//   }

//   async findByEmail(email: string): Promise<User | null> {
//     return prisma.user.findUnique({
//       where: {
//         email
//       }
//     })
//   }

//   async findById(id: string): Promise<User | null> {
//     return prisma.findUnique({
//       where: { id }
//     })
//   }
// }
