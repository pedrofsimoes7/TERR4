/*
  Warnings:

  - A unique constraint covering the columns `[emailVerificationToken]` on the table `CustomerUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CustomerUser" ADD COLUMN     "emailVerificationExpiresAt" TIMESTAMP(3),
ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerUser_emailVerificationToken_key" ON "CustomerUser"("emailVerificationToken");
