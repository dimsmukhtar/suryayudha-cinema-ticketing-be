/*
  Warnings:

  - The values [TOP,LEFT,RIGHT] on the enum `ScreenPlacement` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ScreenPlacement_new" AS ENUM ('top', 'left', 'right');
ALTER TABLE "Studios" ALTER COLUMN "screen_placement" TYPE "ScreenPlacement_new" USING ("screen_placement"::text::"ScreenPlacement_new");
ALTER TYPE "ScreenPlacement" RENAME TO "ScreenPlacement_old";
ALTER TYPE "ScreenPlacement_new" RENAME TO "ScreenPlacement";
DROP TYPE "ScreenPlacement_old";
COMMIT;
