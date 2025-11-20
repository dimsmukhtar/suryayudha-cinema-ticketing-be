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

// mock base
import { createMockService } from '../../mocks/baseMockService'
import { mockReq, mockRes, mockNext } from '../../mocks/mockReqRes'

import { AuthController } from '../../../src/applications/modules/Auth/auth.controller'
import { AuthService } from '../../../src/applications/modules/Auth/auth.service'
import { generateVerificationToken } from '../../../src/shared/helpers/generateVerificationToken'
import { signJwt } from '../../../src/infrastructure/config/jwt'
import { logger } from '../../../src/shared/logger/logger'
import { BadRequestException } from '../../../src/shared/error-handling/exceptions/bad-request.exception'
import { userFactory } from '../../factories/user'

describe('AuthController (unit)', () => {
  let authController: AuthController
  let authServiceMock: Partial<AuthService>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(generateVerificationToken).mockReturnValue('verif-token')
    vi.mocked(signJwt).mockReturnValue('token')
    vi.mocked(logger.info).mockReturnValue(logger)
    vi.mocked(logger.error).mockReturnValue(logger)
    vi.mocked(logger.warn).mockReturnValue(logger)

    authServiceMock = createMockService<AuthService>([
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
    authController = new AuthController(authServiceMock as AuthService)
  })

  it('register -> should call service.register and return 201', async () => {
    const req = mockReq({
      body: { email: 'example@gmail.com', name: 'example', password: '12345678' }
    })
    const res = mockRes()
    const next = mockNext()

    // ini sebenarnya digunakan jika kita perlu return dari register di controller, misal req.json(user). jika tidak perlu return, bisa dihilangkan saja sebenarnya
    const registerMock = vi.spyOn(authServiceMock, 'register')
    registerMock.mockResolvedValue(userFactory({ id: 1, email: 'example@gmail.com' }))

    await authController['register'](req as any, res as any, next)

    expect(authServiceMock.register).toHaveBeenCalled()
    expect(authServiceMock.register).toHaveBeenCalledWith(
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

  it('register -> service throws an error and should call next with error ', async () => {
    const req = mockReq({ body: { email: 'example@gmail.com' } })
    const res = mockRes()
    const next = mockNext()
    const err = new Error('zod error because user only send email')
    const registerMock = vi.spyOn(authServiceMock, 'register')
    registerMock.mockRejectedValue(err)
    await authController['register'](req as any, res as any, next)

    expect(authServiceMock.register).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(err)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('resendVerificationLink -> should call service.resendVerificationLink and return 200', async () => {
    const req = mockReq({ body: { email: 'example@gmail.com' } })
    const res = mockRes()
    const next = mockNext()
    const resendVerificationLinkMock = vi.spyOn(authServiceMock, 'resendVerificationLink')
    resendVerificationLinkMock.mockResolvedValue(undefined) /// undefined, karean service tidak return apa apa alias void

    await authController['resendVerificationLink'](req as any, res as any, next)

    expect(authServiceMock.resendVerificationLink).toHaveBeenCalled()
    expect(authServiceMock.resendVerificationLink).toHaveBeenCalledWith('example@gmail.com')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Link verifikasi berhasil dikirim ulang'
      })
    )
  })

  it('verifyEmail -> should call service.verifyEmail and return 200', async () => {
    const req = mockReq({ query: { token: 'token', email: 'example@gmail.com' } })
    const res = mockRes()
    const next = mockNext()

    const verifyEmailMock = vi.spyOn(authServiceMock, 'verifyEmail')
    verifyEmailMock.mockResolvedValue(undefined)

    await authController['verifyEmail'](req as any, res as any, next)

    expect(authServiceMock.verifyEmail).toHaveBeenCalled()
    expect(authServiceMock.verifyEmail).toHaveBeenCalledWith('token', 'example@gmail.com')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Email berhasil diverifikasi'
      })
    )
  })

  it('verifyEmail -> should return bad request error', async () => {
    const req = mockReq()
    const res = mockRes()
    const next = mockNext()

    await authController['verifyEmail'](req as any, res as any, next)

    const error = next.mock.calls[0][0]
    expect(authServiceMock.verifyEmail).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(error).toBeInstanceOf(BadRequestException)
    expect(error.message).toBe('Token dan email diperlukan untuk verifikasi')
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})
