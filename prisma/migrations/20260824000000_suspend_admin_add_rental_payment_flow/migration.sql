-- Substitui o fluxo de aprovação no painel por pedido temporário,
-- pagamento Stripe e confirmação automática.
CREATE TYPE "RentalStatus_new" AS ENUM ('PENDING_APPROVAL', 'AWAITING_PAYMENT', 'PAID', 'REJECTED', 'EXPIRED', 'CANCELLED');

ALTER TABLE "Rental" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Rental"
  ALTER COLUMN "status" TYPE "RentalStatus_new"
  USING (
    CASE "status"::text
      WHEN 'PENDING' THEN 'PENDING_APPROVAL'
      WHEN 'APPROVED' THEN 'PAID'
      WHEN 'REJECTED' THEN 'REJECTED'
      WHEN 'CANCELLED' THEN 'CANCELLED'
    END
  )::"RentalStatus_new";

ALTER TYPE "RentalStatus" RENAME TO "RentalStatus_old";
ALTER TYPE "RentalStatus_new" RENAME TO "RentalStatus";
DROP TYPE "RentalStatus_old";

ALTER TABLE "Rental"
  ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL',
  ADD COLUMN "decisionTokenHash" TEXT,
  ADD COLUMN "decisionExpiresAt" TIMESTAMP(3),
  ADD COLUMN "paymentExpiresAt" TIMESTAMP(3),
  ADD COLUMN "stripeCheckoutSessionId" TEXT,
  ADD COLUMN "stripePaymentIntentId" TEXT,
  ADD COLUMN "paidAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Rental_decisionTokenHash_key" ON "Rental"("decisionTokenHash");
CREATE UNIQUE INDEX "Rental_stripeCheckoutSessionId_key" ON "Rental"("stripeCheckoutSessionId");
CREATE UNIQUE INDEX "Rental_stripePaymentIntentId_key" ON "Rental"("stripePaymentIntentId");
