import { HttpException } from './http.exception'

export class NotFoundException extends HttpException {
  constructor(entity: string, id?: string | number) {
    const message = id ? `${entity} dengan ID ${id} tidak ditemukan` : `${entity} tidak ditemukan`
    super(404, message)
  }
}
