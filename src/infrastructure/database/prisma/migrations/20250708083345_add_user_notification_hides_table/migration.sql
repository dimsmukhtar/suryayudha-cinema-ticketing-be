-- CreateTable
CREATE TABLE "UserNotificationHides" (
    "id" SERIAL NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "UserNotificationHides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserNotificationHides_notification_id_user_id_key" ON "UserNotificationHides"("notification_id", "user_id");

-- AddForeignKey
ALTER TABLE "UserNotificationHides" ADD CONSTRAINT "UserNotificationHides_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "Notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotificationHides" ADD CONSTRAINT "UserNotificationHides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
