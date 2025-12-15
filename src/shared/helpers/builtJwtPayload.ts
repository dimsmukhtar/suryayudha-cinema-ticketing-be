export function buildJwtPayload(user: any) {
  const now = Math.floor(Date.now() / 1000)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: String(now),
    exp: String(now + 3600)
  }
}
