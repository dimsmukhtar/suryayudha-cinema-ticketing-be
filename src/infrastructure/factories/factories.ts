import { MovieRepositoryPrisma } from '../repositories/MovieRepositoryPrisma'
import { MovieService } from '../../applications/modules/Movie/movie.service'
import { MovieController } from '../../applications/modules/Movie/movie.controller'
import { prisma } from '../database/client'

export const createMovieController = () => {
  const repository = new MovieRepositoryPrisma(prisma)
  const service = new MovieService(repository)
  return new MovieController(service)
}
