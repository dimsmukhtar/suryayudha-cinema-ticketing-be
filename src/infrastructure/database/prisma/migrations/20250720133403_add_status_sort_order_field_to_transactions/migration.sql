/*
  Warnings:

  - Added the required column `status_sort_order` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "status_sort_order" INTEGER NOT NULL;
