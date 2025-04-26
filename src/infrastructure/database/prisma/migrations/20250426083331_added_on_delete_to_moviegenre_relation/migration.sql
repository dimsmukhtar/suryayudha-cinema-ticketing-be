/*
  Warnings:

  - You are about to drop the `Cast` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[schedule_seat_id]` on the table `TransactionItems` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Cast" DROP CONSTRAINT "Cast_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "MovieGenres" DROP CONSTRAINT "MovieGenres_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "MovieGenres" DROP CONSTRAINT "MovieGenres_movie_id_fkey";

-- DropTable
DROP TABLE "Cast";

-- CreateTable
CREATE TABLE "Casts" (
    "id" SERIAL NOT NULL,
    "actor_name" TEXT NOT NULL,
    "actor_url" TEXT NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Casts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionItems_schedule_seat_id_key" ON "TransactionItems"("schedule_seat_id");

-- AddForeignKey
ALTER TABLE "Casts" ADD CONSTRAINT "Casts_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieGenres" ADD CONSTRAINT "MovieGenres_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieGenres" ADD CONSTRAINT "MovieGenres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
