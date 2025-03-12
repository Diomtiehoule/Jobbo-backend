-- AlterTable
ALTER TABLE "City" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Suburb" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Municipality" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
