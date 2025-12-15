import 'express'
import { UserJwtPayload } from '../types/entities/UserTypes'

declare global {
  namespace Express {
    interface User extends UserJwtPayload {}
  }
}
