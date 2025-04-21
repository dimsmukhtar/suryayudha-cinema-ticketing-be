-- AlterTable
ALTER TABLE "Cast" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Genres" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MovieGenres" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Movies" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notifications" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ScheduleSeats" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Schedules" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Seats" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StudioGalleries" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Studios" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tickets" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TransactionItems" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vouchers" ALTER COLUMN "updated_at" DROP NOT NULL;
