/*
  Warnings:

  - Added the required column `screen_placement` to the `Studios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ScreenPlacement" AS ENUM ('TOP', 'LEFT', 'RIGHT');

-- AlterTable
ALTER TABLE "Studios" ADD COLUMN     "screen_placement" "ScreenPlacement" NOT NULL;
