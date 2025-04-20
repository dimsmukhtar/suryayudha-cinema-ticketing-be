import { PrismaClient } from '@prisma/client'
import { Application, ErrorRequestHandler, RequestHandler, Router } from 'express'
import { Logger } from 'winston'
export interface IApp {
  start(): Promise<void>
  getApp(): Application
}
// export interface ApiResponse<T = any> {
//   success: boolean
//   message: string
//   data?: T
//   meta?: {
//     page?: number
//     limit?: number
//     total?: number
//   }
// }
