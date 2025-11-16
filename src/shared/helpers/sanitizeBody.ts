export function sanitizeBody(body: any) {
  const clone: any = { ...body }
  const sensitive = ['password', 'token', 'accessToken', 'refreshToken', 'passwordConfirmation']
  for (const k of sensitive) {
    if (clone[k]) clone[k] = '***MASKED***'
  }
  return clone
}
