import { prisma } from '../database/client'
import { MovieRepositoryPrisma } from '../repositories/MovieRepositoryPrisma'
import { MovieService } from '../../applications/modules/Movie/movie.service'
import { MovieController } from '../../applications/modules/Movie/movie.controller'
import { CastRepositoryPrisma } from '../repositories/CastRepositoryPrisma'
import { CastController } from '../../applications/modules/Cast/cast.controller'
import { CastService } from '../../applications/modules/Cast/cast.service'

export const createMovieController = () => {
  const repository = new MovieRepositoryPrisma(prisma)
  const service = new MovieService(repository)
  return new MovieController(service)
}

export const createCastController = () => {
  const repository = new CastRepositoryPrisma(prisma)
  const service = new CastService(repository)
  return new CastController(service)
}
