/*
  Warnings:

  - You are about to drop the column `imageURL` on the `Blog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `numRatings` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "imageURL";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "numRatings" SET NOT NULL,
ALTER COLUMN "numRatings" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "blogId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
