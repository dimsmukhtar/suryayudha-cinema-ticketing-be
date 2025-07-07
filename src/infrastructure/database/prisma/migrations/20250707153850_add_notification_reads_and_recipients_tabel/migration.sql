/*
  Warnings:

  - You are about to drop the column `is_read` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Notifications` table. All the data in the column will be lost.
  - Added the required column `target_audience` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TARGET_AUDIENCE" AS ENUM ('all', 'spesific');

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_user_id_fkey";

-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "is_read",
DROP COLUMN "user_id",
ADD COLUMN     "target_audience" "TARGET_AUDIENCE" NOT NULL;

-- CreateTable
CREATE TABLE "NotificationRecipients" (
    "id" SERIAL NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "NotificationRecipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotificationReads" (
    "id" SERIAL NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "UserNotificationReads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NotificationRecipients" ADD CONSTRAINT "NotificationRecipients_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "Notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRecipients" ADD CONSTRAINT "NotificationRecipients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotificationReads" ADD CONSTRAINT "UserNotificationReads_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "Notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotificationReads" ADD CONSTRAINT "UserNotificationReads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
