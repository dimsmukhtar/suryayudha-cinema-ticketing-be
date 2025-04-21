import { Prisma } from '@prisma/client'
import { ConflictException } from '../exceptions/conflict.exception'
import { NotFoundException } from '../exceptions/not-found.exception'
import { HttpException } from '../exceptions/http.exception'
import { BadRequestException } from '../exceptions/bad-request.exception'
import { InternalServerErrorException } from '../exceptions/internal-server.exception'
import { logger } from '../../../shared/utils/logger'
import { ZodError } from 'zod'

type HandleErrorOptions = {
  context?: string
}
export function CustomHandleError(error: any, options: HandleErrorOptions = {}): HttpException {
  const { context = '[Application]' } = options
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new ConflictException('[P2002] - Duplicate entry violation')
      case 'P2025':
        return new NotFoundException('[P2025] - Related resource')
      default:
        return new HttpException(
          500,
          `[In PrismaClientKnownRequestError] - Database error: ${error.message}`
        )
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new BadRequestException(`${context} - Invalid input data format`)
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    logger.error(`${context} - Database connection error:`, error)
    return new InternalServerErrorException(`${context} - Database connection failed`)
  }

  if (error instanceof ZodError) {
    const messages = error.errors.map((e) => e.message).join(', ')
    return new BadRequestException(`${context} - VALIDATION_ERROR: ${messages}`)
  }

  logger.error(`${context} - Unhandled error type:`, error)
  return new HttpException(error.statusCode, error.message, error.errorCode)
}
