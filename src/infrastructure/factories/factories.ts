import { MovieRepository } from '../repositories/Movie/movie.repository'
import { MovieService } from '../../applications/modules/Movie/movie.service'
import { MovieController } from '../../applications/modules/Movie/movie.controller'

export const createMovieController = () => {
  const repository = new MovieRepository()
  const service = new MovieService(repository)
  return new MovieController(service)
}
