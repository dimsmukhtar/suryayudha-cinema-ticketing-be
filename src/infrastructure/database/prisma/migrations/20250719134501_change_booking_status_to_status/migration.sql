/*
  Warnings:

  - You are about to drop the column `booking_status` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `status` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('initiated', 'pending', 'cancelled', 'settlement');

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "booking_status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL;

-- DropEnum
DROP TYPE "BookingStatus";
