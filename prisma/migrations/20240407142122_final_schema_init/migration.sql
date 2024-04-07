/*
  Warnings:

  - Added the required column `currency` to the `PlansOffered` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlansOffered" ADD COLUMN     "currency" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePicture" TEXT;
