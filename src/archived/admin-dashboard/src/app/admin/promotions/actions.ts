"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { broadcastPromotion } from "@/lib/marketing";

export type PromotionState = {
  error?: string;
  success?: string;
} | null;

// Criar uma promoção: define salePriceCents + saleEndsAt no produto,
// e dispara email a todos os clientes com consentimento.
export async function createPromotionAction(
  _prevState: PromotionState,
  formData: FormData
): Promise<PromotionState> {
  await requireAdmin();

  const productId = String(formData.get("productId") || "");
  const salePrice = Number(formData.get("salePrice") || 0);
  const endsAtRaw = String(formData.get("endsAt") || "").trim();

  if (!productId) {
    return { error: "Escolhe um produto." };
  }
  if (!salePrice || salePrice <= 0) {
    return { error: "Indica um preço promocional válido." };
  }
  if (!endsAtRaw) {
    return { error: "Indica a data de fim da promoção." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return { error: "Produto não encontrado." };
  }
  if (!product.priceCents) {
    return { error: "Este produto não tem preço definido." };
  }

  const salePriceCents = Math.round(salePrice * 100);

  if (salePriceCents >= product.priceCents) {
    return {
      error: "O preço promocional tem de ser menor que o preço normal.",
    };
  }

  const endsAt = new Date(endsAtRaw);
  if (isNaN(endsAt.getTime()) || endsAt <= new Date()) {
    return { error: "A data de fim tem de ser no futuro." };
  }

  // Aplica a promoção
  await prisma.product.update({
    where: { id: productId },
    data: {
      salePriceCents,
      saleEndsAt: endsAt,
    },
  });

  const discountPercent = Math.round(
    ((product.priceCents - salePriceCents) / product.priceCents) * 100
  );

  // Dispara emails aos clientes com consentimento
  let sentCount = 0;
  try {
    sentCount = await broadcastPromotion({
      productName: product.name,
      productSlug: product.slug,
      oldPriceCents: product.priceCents,
      newPriceCents: salePriceCents,
      discountPercent,
      saleEndsAt: endsAt,
    });
  } catch (e) {
    console.error("Erro ao enviar emails de promoção:", e);
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${product.slug}`);
  revalidatePath("/admin/promotions");

  return {
    success: `Promoção criada! ${sentCount} email${sentCount === 1 ? "" : "s"} enviado${sentCount === 1 ? "" : "s"} a clientes.`,
  };
}

// Terminar uma promoção antes do tempo (limpa os campos)
export async function endPromotionAction(formData: FormData) {
  await requireAdmin();

  const productId = String(formData.get("productId") || "");
  if (!productId) return;

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      salePriceCents: null,
      saleEndsAt: null,
    },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${product.slug}`);
  revalidatePath("/admin/promotions");
}