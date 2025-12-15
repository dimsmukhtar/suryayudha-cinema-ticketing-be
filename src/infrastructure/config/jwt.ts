import jwt from 'jsonwebtoken'

const getKey = (key: string) => {
  return process.env[key]?.replace(/\\n/g, '\n') as string
}
export function signJwt(
  object: Object,
  keyName: 'ACCESS_TOKEN_PRIVATE_KEY' | 'REFRESH_TOKEN_PRIVATE_KEY',
  options?: jwt.SignOptions | undefined
) {
  const privateKey = getKey(keyName)
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256'
  })
}

export function verifyJwtToken<T>(
  token: string,
  keyName: 'ACCESS_TOKEN_PUBLIC_KEY' | 'REFRESH_TOKEN_PUBLIC_KEY'
): T | null {
  const publicKey = getKey(keyName)
  try {
    const decoded = jwt.verify(token, publicKey) as T
    return decoded
  } catch (error) {
    return null
  }
}
