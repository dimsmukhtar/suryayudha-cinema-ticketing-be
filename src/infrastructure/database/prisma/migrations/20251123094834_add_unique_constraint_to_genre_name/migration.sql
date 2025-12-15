/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Genres` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Genres_name_key" ON "Genres"("name");
