import { Router } from 'express'

import productRouter from './product.route'

const v1Router: Router = Router()

v1Router.use('/products', productRouter)

export default v1Router
