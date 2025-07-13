/*
  Warnings:

  - The primary key for the `Studios` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Schedules" DROP CONSTRAINT "Schedules_studio_id_fkey";

-- DropForeignKey
ALTER TABLE "Seats" DROP CONSTRAINT "Seats_studio_id_fkey";

-- DropForeignKey
ALTER TABLE "StudioGalleries" DROP CONSTRAINT "StudioGalleries_studio_id_fkey";

-- AlterTable
ALTER TABLE "Schedules" ALTER COLUMN "studio_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Seats" ALTER COLUMN "studio_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StudioGalleries" ALTER COLUMN "studio_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Studios" DROP CONSTRAINT "Studios_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Studios_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Studios_id_seq";

-- AddForeignKey
ALTER TABLE "StudioGalleries" ADD CONSTRAINT "StudioGalleries_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "Studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seats" ADD CONSTRAINT "Seats_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "Studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedules" ADD CONSTRAINT "Schedules_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "Studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
