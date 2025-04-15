import { Router } from 'express'

import v1Routes from './v1/index'

const appRouter: Router = Router()

appRouter.use('/v1', v1Routes)

export default appRouter
