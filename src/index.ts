import express, { type Request, type Response, type NextFunction, type Application } from 'express'
import 'dotenv/config'

const app: Application = express()
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
