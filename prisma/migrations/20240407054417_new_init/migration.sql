/*
  Warnings:

  - The `imageURL` column on the `Blog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "imageURL",
ADD COLUMN     "imageURL" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
