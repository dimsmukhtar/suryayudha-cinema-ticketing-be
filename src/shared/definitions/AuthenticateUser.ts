import { Request } from 'express'

export interface AuthenticateUser extends Request {
  user: {
    id: number
  }
}
