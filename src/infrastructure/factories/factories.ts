import { MovieRepositoryPrisma } from '../repositories/Movie/MovieRepositoryPrisma'
import { MovieService } from '../../applications/modules/Movie/movie.service'
import { MovieController } from '../../applications/modules/Movie/movie.controller'

export const createMovieController = () => {
  const repository = new MovieRepositoryPrisma()
  const service = new MovieService(repository)
  return new MovieController(service)
}
