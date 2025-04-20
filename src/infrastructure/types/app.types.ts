import { Application } from 'express'

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
