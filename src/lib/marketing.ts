import { prisma } from "@/lib/prisma";
import { sendPromotionEmail, sendNewProductEmail } from "@/lib/email";

/**
 * Envia email de PROMOÇÃO a todos os clientes que deram consentimento
 * de marketing (marketingConsent = true) e já verificaram o email.
 * Envia um a um, com tratamento de erros, para não falhar tudo se um falhar.
 * Devolve quantos foram enviados.
 */
export async function broadcastPromotion({
  productName,
  productSlug,
  oldPriceCents,
  newPriceCents,
  discountPercent,
  saleEndsAt,
}: {
  productName: string;
  productSlug: string;
  oldPriceCents: number;
  newPriceCents: number;
  discountPercent: number;
  saleEndsAt?: Date | null;
}) {
  const recipients = await prisma.customerUser.findMany({
    where: {
      marketingConsent: true,
      emailVerifiedAt: { not: null }, // só quem confirmou o email
    },
    select: { name: true, email: true },
  });

  let sent = 0;
  for (const r of recipients) {
    try {
      await sendPromotionEmail({
        customerName: r.name || "",
        customerEmail: r.email,
        productName,
        productSlug,
        oldPrice: oldPriceCents,
        newPrice: newPriceCents,
        discountPercent,
        saleEndsAt,
      });
      sent++;
    } catch (e) {
      console.error(`Erro a enviar promoção para ${r.email}:`, e);
    }
  }
  return sent;
}

/**
 * Envia email de PRODUTO NOVO a todos os clientes com consentimento.
 */
export async function broadcastNewProduct({
  productName,
  productSlug,
  priceCents,
  shortDescription,
}: {
  productName: string;
  productSlug: string;
  priceCents?: number | null;
  shortDescription?: string;
}) {
  const recipients = await prisma.customerUser.findMany({
    where: {
      marketingConsent: true,
      emailVerifiedAt: { not: null },
    },
    select: { name: true, email: true },
  });

  let sent = 0;
  for (const r of recipients) {
    try {
      await sendNewProductEmail({
        customerName: r.name || "",
        customerEmail: r.email,
        productName,
        productSlug,
        price: priceCents,
        shortDescription,
      });
      sent++;
    } catch (e) {
      console.error(`Erro a enviar novo produto para ${r.email}:`, e);
    }
  }
  return sent;
}