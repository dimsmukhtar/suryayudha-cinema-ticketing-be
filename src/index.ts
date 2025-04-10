import express, { type Application } from 'express'
import 'dotenv/config'

import routes from './routes/index'

const app: Application = express()
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000

app.use(express.json())

app.use(routes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
