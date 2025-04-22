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
        return new ConflictException(`GOT [P2002] ${context}: ${error.message}`)
      case 'P2025':
        return new NotFoundException(`GOT [P2025] ${context}: ${error.message}`)
      default:
        return new HttpException(
          500,
          `GOT [PRISMA_CLIENT_KNOWN_REQUEST_ERROR] ${context}: ${error.message}`,
          'PRISMA_CLIENT_KNOWN_REQUEST_ERROR'
        )
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new BadRequestException(
      `GOT [PRISMA_CLIENT_VALIDATION_ERROR] ${context}: ${error.message}`
    )
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    logger.error(
      `GOT [PRISMA_CLIENT_INITIALIZATION_ERROR or PRISMA_CLIENT_RUST_PANIC_ERROR] ${context}:`,
      error
    )
    return new InternalServerErrorException(
      `GOT [PRISMA_CLIENT_INITIALIZATION_ERROR or PRISMA_CLIENT_RUST_PANIC_ERROR] ${context}: ${error.message}`
    )
  }

  if (error instanceof ZodError) {
    const messages = error.errors.map((e) => e.message).join(', ')
    return new BadRequestException(`GOT [ZOD_VALIDATION_ERROR] ${context}: ${messages}`)
  }

  return new HttpException(error.statusCode, error.message, error.errorCode)
}
