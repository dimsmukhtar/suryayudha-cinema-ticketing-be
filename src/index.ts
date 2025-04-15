import express, { Application } from 'express'
import 'dotenv/config'
import appMiddleware from './middlewares/index'

const app: Application = express()
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000

app.use(appMiddleware)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
