/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "payment_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_order_id_key" ON "Transactions"("order_id");
