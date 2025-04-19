import { HttpException } from './http.exception'

export class ConflictException extends HttpException {
  constructor(message = 'Resource sudah ada') {
    super(409, message)
  }
}
