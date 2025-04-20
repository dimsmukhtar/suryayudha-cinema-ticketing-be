import { Prisma } from '@prisma/client'
import { ConflictException } from '../exceptions/conflict.exception'
import { NotFoundException } from '../exceptions/not-found.exception'
import { HttpException } from '../exceptions/http.exception'

export function handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    case 'P2002':
      throw new ConflictException('Duplicate entry violation')
    case 'P2025':
      throw new NotFoundException('Related resource')
    default:
      throw new HttpException(500, `Database error: ${error.message}`)
  }
}
