import { Prisma } from '@prisma/client'
import { ConflictException } from '../exceptions/conflict.exception'
import { NotFoundException } from '../exceptions/not-found.exception'
import { HttpException } from '../exceptions/http.exception'
import { BadRequestException } from '../exceptions/bad-request.exception'
import { InternalServerErrorException } from '../exceptions/internal-server.exception'
import { logger } from '../../../shared/utils/logger'

type HandleErrorOptions = {
  context?: string
}
export function CustomHandleError(error: unknown, options: HandleErrorOptions = {}): HttpException {
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

  if (error instanceof Error) {
    logger.error(`${context} - Unexpected error:`, error)
    return new InternalServerErrorException(error.message || `${context} - Internal server error`)
  }

  logger.error(`${context} - Unhandled error type:`, error)
  return new InternalServerErrorException(`${context} - Unknown error occurred`)
}
