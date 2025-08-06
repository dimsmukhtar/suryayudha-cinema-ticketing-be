import { Response } from 'express'

export const setAccessToken = (accessToken: string, res: Response) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // best pratice use 15 minutes with refresh token, but now i dont have refresh token yet, so i set 60 minutes
    secure: process.env.NODE_ENV === 'PRODUCTION',
    // sameSite: 'none'
    sameSite: 'lax' // lax for lokal
  })
}

export const setRefreshToken = (refreshToken: string, res: Response) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    secure: process.env.NODE_ENV === 'PRODUCTION',
    // sameSite: 'none'
    sameSite: 'lax'
  })
}
