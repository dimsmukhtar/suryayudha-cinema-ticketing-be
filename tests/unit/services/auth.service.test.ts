import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/shared/logger/logger')
vi.mock('../../../src/shared/error-handling/middleware/custom-handle')
vi.mock('../../../src/shared/middlewares/validation.middleware', () => ({
  ZodValidation: {
    validate: vi.fn()
  }
}))

import { AuthService } from '../../../src/applications/modules/Auth/auth.service'
import { AuthRepositoryPrisma } from '../../../src/infrastructure/repositories/AuthRepositoryPrisma'
import { logger } from '../../../src/shared/logger/logger'
import { CustomHandleError } from '../../../src/shared/error-handling/middleware/custom-handle'
import { HttpException } from '../../../src/shared/error-handling/exceptions/http.exception'
import { createMockService } from '../../mocks/baseMockService'
import { ZodValidation } from '../../../src/shared/middlewares/validation.middleware'

describe('Auth Service (unit)', () => {
  let authService: AuthService
  let authRepositoryPrismaMock: Partial<AuthRepositoryPrisma>

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(CustomHandleError).mockImplementation(() => {
      return new HttpException(500, 'error')
    })
    vi.mocked(ZodValidation.validate).mockReturnValue({} as any)
    vi.mocked(logger.info).mockReturnValue(logger)
    vi.mocked(logger.error).mockReturnValue(logger)
    vi.mocked(logger.warn).mockReturnValue(logger)

    authRepositoryPrismaMock = createMockService<AuthRepositoryPrisma>([
      'register',
      'resendVerificationLink',
      'verifyEmail',
      'login',
      'getProfile',
      'updateProfile',
      'changePassword',
      'sendTokenResetPassword',
      'resetPassword'
    ])

    authService = new AuthService(authRepositoryPrismaMock as AuthRepositoryPrisma)
  })

  it('register -> should call repository.register and return user', async () => {
    const registerMock = vi.spyOn(authRepositoryPrismaMock, 'register')
    registerMock.mockResolvedValue({} as any)

    const user = await authService['register']({} as any)

    expect(authRepositoryPrismaMock.register).toHaveBeenCalled()
    expect(authRepositoryPrismaMock.register).toHaveBeenCalledWith({} as any)
    expect(ZodValidation.validate).toHaveBeenCalled()
    expect(user).toEqual({})
  })
})
