import cron from 'node-cron'
import { logger } from '../../shared/utils/logger'
import { cancelExpiredBookings } from './cancel-expired-bookings'
import { cancelExpiredPayments } from './cancel-expired-payments'

export const scheduleAllJobs = () => {
  cron.schedule('* * * * *', cancelExpiredBookings)
  cron.schedule('* * * * *', cancelExpiredPayments)

  logger.info('✅ Semua cron job berhasil di jalankan! ✅')
}
