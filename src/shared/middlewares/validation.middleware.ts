import { ZodType } from 'zod'

export class ZodValidation {
  static validate<T>(schema: ZodType, data: T): T {
    return schema.parse(data)
  }
}
