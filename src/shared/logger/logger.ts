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

const addRequestId = format((info) => {
  const id = asyncContext.getRequestId()
  if (id) info.requestId = id
  return info
})

const fileFormat = format.combine(
  addRequestId(),
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
)

const jsonFormat = format((info) => {
  const { from, level, message, timestamp, requestId, ...meta } = info

  const logObj: Record<string, any> = {
    from,
    message,
    level,
    requestId,
    timestamp,
    ...meta
  }

  info[Symbol.for('message')] = JSON.stringify(logObj, null, 2)
  return info
})

const consoleFormat = format.combine(
  addRequestId(),
  format.errors({ stack: true }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  jsonFormat(),
  format.colorize({ message: true })
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
