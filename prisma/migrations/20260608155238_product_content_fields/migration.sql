-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "featuresJson" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "trustItemsJson" TEXT NOT NULL DEFAULT '[]';
