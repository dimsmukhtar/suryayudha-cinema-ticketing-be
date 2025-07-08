/*
  Warnings:

  - Added the required column `photo_id` to the `StudioGalleries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudioGalleries" ADD COLUMN     "photo_id" TEXT NOT NULL;
