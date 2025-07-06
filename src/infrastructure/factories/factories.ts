import { prisma } from '../database/client'
import { MovieRepositoryPrisma } from '../repositories/MovieRepositoryPrisma'
import { MovieService } from '../../applications/modules/Movie/movie.service'
import { MovieController } from '../../applications/modules/Movie/movie.controller'
import { CastRepositoryPrisma } from '../repositories/CastRepositoryPrisma'
import { CastController } from '../../applications/modules/Cast/cast.controller'
import { CastService } from '../../applications/modules/Cast/cast.service'
import { GenreRepositoryPrisma } from '../repositories/GenreRepositoryPrisma'
import { GenreController } from '../../applications/modules/Genre/genre.controller'
import { GenreService } from '../../applications/modules/Genre/genre.service'
import { UserService } from '../../applications/modules/User/user.service'
import { UserRepositoryPrisma } from '../repositories/UserRepositoryPrisma'
import { UserController } from '../../applications/modules/User/user.controller'

export const factoriesMovieController = () => {
  const repository = new MovieRepositoryPrisma(prisma)
  const service = new MovieService(repository)
  return new MovieController(service)
}

export const factoriesCastController = () => {
  const repository = new CastRepositoryPrisma(prisma)
  const service = new CastService(repository)
  return new CastController(service)
}

export const factoriesGenreController = () => {
  const repository = new GenreRepositoryPrisma(prisma)
  const service = new GenreService(repository)
  return new GenreController(service)
}

export const factoriesUserController = () => {
  const repository = new UserRepositoryPrisma(prisma)
  const service = new UserService(repository)
  return new UserController(service)
}
