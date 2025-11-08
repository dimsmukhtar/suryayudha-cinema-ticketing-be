import winston from 'winston'

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message }) => {
      return `${new Date().toISOString()} - ${level}: ${message}`
    })
  ),
  transports: [new winston.transports.Console()]
})
