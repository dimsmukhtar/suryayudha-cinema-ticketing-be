import { Router } from 'express'

import productRouter from './product.route'

const appRouter = Router()

appRouter.use('/api/v1/product', productRouter)

export default appRouter
