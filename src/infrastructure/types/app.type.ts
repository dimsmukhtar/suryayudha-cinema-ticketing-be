import { Application } from 'express'

export interface IApp {
  start(): Promise<void>
}
