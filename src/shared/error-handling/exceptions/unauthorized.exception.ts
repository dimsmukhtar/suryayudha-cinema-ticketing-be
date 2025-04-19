import { HttpException } from './http.exception'

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized access') {
    super(401, message)
  }
}
