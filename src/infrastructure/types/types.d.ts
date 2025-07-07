import { UserJwtPayload } from '../types/entities/UserTypes'

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload
    }
  }
}
