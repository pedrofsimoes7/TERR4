-- AlterTable
ALTER TABLE "CustomerUser" ADD COLUMN     "marketingConsent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "saleEndsAt" TIMESTAMP(3),
ADD COLUMN     "salePriceCents" INTEGER;
