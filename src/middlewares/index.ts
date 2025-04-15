import express from 'express'
import cors from 'cors'
import '../utils/logger'

import routes from '../routes'
import errorHandler from './errorHandler'

const appMiddleware = express()

appMiddleware.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'Head', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
)

appMiddleware.use(express.json())

appMiddleware.use('/api', routes)
appMiddleware.use(errorHandler)

export default appMiddleware
