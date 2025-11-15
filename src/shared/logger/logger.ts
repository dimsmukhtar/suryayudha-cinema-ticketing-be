import winston, { format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import * as path from 'path'
import * as fs from 'fs'

import { asyncContext } from './async-context'

const LOG_DIR = process.env.LOG_DIRECTORY
  ? path.resolve(process.env.LOG_DIRECTORY)
  : path.resolve('logs')

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })

const NODE_ENV = process.env.NODE_ENV ?? 'development'
const defaultLevel =
  NODE_ENV === 'development' ? 'debug' : NODE_ENV === 'production' ? 'info' : 'debug'

const maskSensitive = format((info) => {
  const sensitiveKeys = ['password', 'token', 'accessToken', 'refreshToken']
  for (const k of sensitiveKeys) {
    if (Object.prototype.hasOwnProperty.call(info, k)) {
      info[k] = '***MASKED***'
    }
  }
  return info
})

const addRequestId = format((info) => {
  const id = asyncContext.getRequestId()
  if (id) info.requestId = id
  return info
})

const fileFormat = format.combine(
  addRequestId(),
  maskSensitive(),
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
)

const consoleFormat = format.combine(
  addRequestId(),
  maskSensitive(),
  format.colorize(),
  format.errors({ stack: true }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => {
    return `[${info.timestamp}] - [${info.level}]: [${info.message}] - [reqId=${info.requestId}]`
  })
)

export const logger = winston.createLogger({
  level: defaultLevel,
  transports: [
    new transports.Console({
      format: consoleFormat
    }),
    new DailyRotateFile({
      level: 'info',
      dirname: LOG_DIR,
      filename: '%DATE%-info.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: fileFormat
    }),
    new DailyRotateFile({
      level: 'error',
      dirname: LOG_DIR,
      filename: '%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: fileFormat
    })
  ],
  exitOnError: false
})
