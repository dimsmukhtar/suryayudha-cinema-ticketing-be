/*
  Warnings:

  - You are about to drop the column `payment_status` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `type` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('booking', 'payment');

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "payment_status",
ADD COLUMN     "type" "TransactionType" NOT NULL;
