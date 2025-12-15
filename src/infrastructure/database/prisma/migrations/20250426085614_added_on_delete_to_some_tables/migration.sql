-- DropForeignKey
ALTER TABLE "Casts" DROP CONSTRAINT "Casts_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSeats" DROP CONSTRAINT "ScheduleSeats_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSeats" DROP CONSTRAINT "ScheduleSeats_seat_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedules" DROP CONSTRAINT "Schedules_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedules" DROP CONSTRAINT "Schedules_studio_id_fkey";

-- DropForeignKey
ALTER TABLE "Seats" DROP CONSTRAINT "Seats_studio_id_fkey";

-- DropForeignKey
ALTER TABLE "StudioGalleries" DROP CONSTRAINT "StudioGalleries_studio_id_fkey";

-- DropForeignKey
ALTER TABLE "Tickets" DROP CONSTRAINT "Tickets_transaction_item_id_fkey";

-- DropForeignKey
ALTER TABLE "TransactionItems" DROP CONSTRAINT "TransactionItems_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Casts" ADD CONSTRAINT "Casts_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudioGalleries" ADD CONSTRAINT "StudioGalleries_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "Studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seats" ADD CONSTRAINT "Seats_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "Studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedules" ADD CONSTRAINT "Schedules_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedules" ADD CONSTRAINT "Schedules_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "Studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSeats" ADD CONSTRAINT "ScheduleSeats_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "Schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSeats" ADD CONSTRAINT "ScheduleSeats_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "Seats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItems" ADD CONSTRAINT "TransactionItems_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tickets" ADD CONSTRAINT "Tickets_transaction_item_id_fkey" FOREIGN KEY ("transaction_item_id") REFERENCES "TransactionItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
