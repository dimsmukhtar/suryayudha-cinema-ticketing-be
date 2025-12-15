import { HttpException } from './http.exception'

export class NotFoundException extends HttpException {
  constructor(message: string, id?: string | number) {
    super(404, message, 'NOT_FOUND')
  }
}
