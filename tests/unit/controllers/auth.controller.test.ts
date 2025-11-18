import { beforeEach, describe, it, vi, Mock, expect } from 'vitest'

// cara di bawah ini akan error mock kehilangan return value karena di beforeEach saya clearAllMocks
// vi.mock('../../../src/shared/helpers/generateVerificationToken', () => ({
//   generateVerificationToken: vi.fn().mockReturnValue('verif-token')
// }))

// vi.mock('../../../src/shared/helpers/setCookies', () => ({
//   setAccessToken: vi.fn()
// }))

// vi.mock('../../../src/infrastructure/config/jwt', () => ({
//   signJwt: vi.fn().mockReturnValue('token')
// }))

// vi.mock('../../../src/shared/logger/logger', () => ({
//   logger: {
//     info: vi.fn(),
//     error: vi.fn(),
//     warn: vi.fn()
//   }
// }))

vi.mock('../../../src/shared/helpers/generateVerificationToken')
vi.mock('../../../src/shared/helpers/setCookies')
vi.mock('../../../src/infrastructure/config/jwt')
vi.mock('../../../src/shared/logger/logger')

import { AuthController } from '../../../src/applications/modules/Auth/auth.controller'
import { AuthService } from '../../../src/applications/modules/Auth/auth.service'
import { mockReq, mockRes, mockNext } from '../../mocks/mockReqRes'
import { generateVerificationToken } from '../../../src/shared/helpers/generateVerificationToken'
import { signJwt } from '../../../src/infrastructure/config/jwt'
import { logger } from '../../../src/shared/logger/logger'

describe('AuthController (unit)', () => {
  let authController: AuthController

  const mockService: Partial<AuthService> = {
    register: vi.fn(),
    resendVerificationLink: vi.fn(),
    verifyEmail: vi.fn(),
    login: vi.fn(),
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
    sendTokenResetPassword: vi.fn(),
    resetPassword: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(generateVerificationToken).mockReturnValue('verif-token')
    vi.mocked(signJwt).mockReturnValue('token')
    vi.mocked(logger.info).mockReturnValue(logger)
    vi.mocked(logger.error).mockReturnValue(logger)
    vi.mocked(logger.warn).mockReturnValue(logger)
    authController = new AuthController(mockService as AuthService)
  })

  it('register -> should call service.register and return 201', async () => {
    const req = mockReq({
      body: { email: 'example@gmail.com', name: 'example', password: '12345678' }
    })
    const res = mockRes()
    const next = mockNext()

    ;(mockService.register as Mock).mockResolvedValue({
      id: 1,
      email: 'example@gmail.com'
    })

    await authController['register'](req as any, res as any, next)

    expect(mockService.register).toHaveBeenCalled()
    expect(mockService.register).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'example@gmail.com',
        name: 'example',
        password: '12345678',
        role: 'user',
        is_verified: false,
        verification_token: 'verif-token',
        verification_token_expires_at: expect.any(Date),
        profile_url: 'https://ik.imagekit.io/yxctvbjvh/profilepic.png?updatedAt=1734338115538'
      })
    )
    expect(generateVerificationToken).toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'auth:register:controller', message: expect.any(String) })
    )
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message:
          'Berhasil register dan verifikasi link telah dikirim ke email anda!, silahkan cek email untuk verifikasi'
      })
    )
  })
})
