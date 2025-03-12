/*
  Warnings:

  - You are about to drop the column `is_active` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Suburb` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Municipality` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "City" DROP COLUMN "is_active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Suburb" DROP COLUMN "is_active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Municipality" DROP COLUMN "is_active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
