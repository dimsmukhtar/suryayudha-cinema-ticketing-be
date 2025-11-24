import { Response } from 'express'

const sameSite: 'lax' | 'none' = process.env.NODE_ENV === 'production' ? 'none' : 'lax'

export const setAccessToken = (accessToken: string, res: Response) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 15, // 15 minutes
    secure: process.env.NODE_ENV === 'production',
    sameSite,
    path: '/'
  })
}

export const setRefreshToken = (refreshToken: string, res: Response) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite,
    path: '/'
  })
}
