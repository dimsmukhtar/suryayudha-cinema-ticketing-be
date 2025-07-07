/*
  Warnings:

  - A unique constraint covering the columns `[notification_id,user_id]` on the table `NotificationRecipients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[notification_id,user_id]` on the table `UserNotificationReads` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "NotificationRecipients_user_id_idx" ON "NotificationRecipients"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationRecipients_notification_id_user_id_key" ON "NotificationRecipients"("notification_id", "user_id");

-- CreateIndex
CREATE INDEX "UserNotificationReads_user_id_idx" ON "UserNotificationReads"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserNotificationReads_notification_id_user_id_key" ON "UserNotificationReads"("notification_id", "user_id");
