-- Regista separadamente a entrega das notificações de pagamento para permitir
-- tentativas seguras quando a Stripe volta a entregar o mesmo webhook.
ALTER TABLE "Order"
  ADD COLUMN "companyPaidEmailSentAt" TIMESTAMP(3);

ALTER TABLE "Rental"
  ADD COLUMN "customerPaidEmailSentAt" TIMESTAMP(3),
  ADD COLUMN "companyPaidEmailSentAt" TIMESTAMP(3);
