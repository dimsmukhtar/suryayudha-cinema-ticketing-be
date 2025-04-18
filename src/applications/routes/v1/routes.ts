// File: src/applications/routes/v1/v1.routes.ts
import { Router } from 'express'
import { MovieRoutes } from './movie.routes'

export class V1Routes {
  private readonly router: Router
  private readonly prefix = '/v1'

  constructor() {
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // Mount movie routes
    const movieRoutes = new MovieRoutes()
    this.router.use(`${this.prefix}/movies`, movieRoutes.getRouter())

    // Tambahkan routes lain di sini contoh:
    // this.router.use(`${this.prefix}/users`, new UserRoutes().getRouter())
  }

  public getRouter(): Router {
    return this.router
  }
}
