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
import { NotificationRepositoryPrisma } from '../repositories/NotificationRepositoryPrisma'
import { NotificationService } from '../../applications/modules/Notification/notification.service'
import { NotificationController } from '../../applications/modules/Notification/notification.controller'
import { StudioRepositoryPrisma } from '../repositories/StudioRepositoryPrisma'
import { StudioService } from '../../applications/modules/Studio/studio.service'
import { StudioController } from '../../applications/modules/Studio/studio.controller'
import { ScheduleRepositoryPrisma } from '../repositories/ScheduleRepositoryPrisma'
import { ScheduleService } from '../../applications/modules/Schedule/schedule.service'
import { ScheduleController } from '../../applications/modules/Schedule/schedule.controller'
import { VoucherRepositoryPrisma } from '../repositories/VoucherRepositoryPrisma'
import { VoucherService } from '../../applications/modules/Voucher/voucher.service'
import { VoucherController } from '../../applications/modules/Voucher/voucher.controller'
import { TransactionRepositoryPrisma } from '../repositories/TransactionRepositoryPrisma'
import { TransactionService } from '../../applications/modules/Transaction/transaction.service'
import { TransactionController } from '../../applications/modules/Transaction/transaction.controller'

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

export const factoriesNotificationController = () => {
  const repository = new NotificationRepositoryPrisma(prisma)
  const service = new NotificationService(repository)
  return new NotificationController(service)
}

export const factoriesStudioController = () => {
  const repository = new StudioRepositoryPrisma(prisma)
  const service = new StudioService(repository)
  return new StudioController(service)
}

export const factoriesScheduleController = () => {
  const repository = new ScheduleRepositoryPrisma(prisma)
  const service = new ScheduleService(repository)
  return new ScheduleController(service)
}

export const factoriesVoucherController = () => {
  const repository = new VoucherRepositoryPrisma(prisma)
  const service = new VoucherService(repository)
  return new VoucherController(service)
}

export const factoriesTransactionController = () => {
  const repository = new TransactionRepositoryPrisma(prisma)
  const service = new TransactionService(repository)
  return new TransactionController(service)
}
