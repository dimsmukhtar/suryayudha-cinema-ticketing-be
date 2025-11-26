import { vi } from 'vitest'

export const mockReq = (overrides: Record<string, any> = {}) => {
  return {
    body: overrides.body ?? {},
    params: overrides.params ?? {},
    query: overrides.query ?? {},
    user: overrides.user ?? undefined,
    file: overrides.file ?? undefined,
    cookies: overrides.cookies ?? {},
    headers: overrides.headers ?? {},
    ...overrides
  }
}

export const mockRes = () => {
  const res: any = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  res.send = vi.fn().mockReturnValue(res)
  res.clearCookie = vi.fn().mockReturnValue(res)
  res.cookie = vi.fn().mockReturnValue(res)
  res.redirect = vi.fn().mockReturnValue(res)
  return res
}

export const mockNext = () => vi.fn()
