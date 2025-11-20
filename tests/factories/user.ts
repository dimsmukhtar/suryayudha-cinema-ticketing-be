import { User } from '@prisma/client'

export const userFactory = (override: Partial<User> = {}): User => ({
  id: 1,
  name: 'Example User',
  email: 'example@gmail.com',
  role: 'user',
  password: 'hashedpass',
  is_verified: false,
  verification_token: 'abc',
  verification_token_expires_at: new Date(),
  reset_password_token: null,
  reset_password_token_expires_at: null,
  profile_url: null,
  provider: 'local',
  providerId: null,
  created_at: new Date(),
  updated_at: new Date(),
  ...override
})
