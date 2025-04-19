import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { HttpException } from '../error-handling/exceptions/http.exception'

export const validateResource =
  (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))

        next(
          new HttpException(
            400,
            `Validasi gagal: ${formattedErrors.map((e) => e.message).join(', ')}`
          )
        )
      } else {
        next(new HttpException(500, 'Internal Server Error'))
      }
    }
  }
