import { Router, type Request, type Response } from 'express'
const productRouter = Router()

productRouter.get('/product', (req: Request, res: Response) => {
  res.status(200).send({
    message: 'productttttt'
  })
})

export default productRouter
