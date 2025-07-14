-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_voucher_id_fkey";

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "voucher_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "Vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
