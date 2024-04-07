-- AlterTable
ALTER TABLE "PlansOffered" ADD COLUMN     "overallRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalRatings" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "plansOfferedId" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_plansOfferedId_fkey" FOREIGN KEY ("plansOfferedId") REFERENCES "PlansOffered"("id") ON DELETE SET NULL ON UPDATE CASCADE;
