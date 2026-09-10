"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type CheckoutItem = {
  slug: string;
  quantity: number;
};

// Calcula o preço unitário a cobrar: se o produto tem promoção ativa
// (salePriceCents válido e data não passou), usa o preço promocional.
// Senão, usa o preço normal. Feito no SERVIDOR = seguro.
function getUnitCents(product: {
  priceCents: number | null;
  salePriceCents: number | null;
  saleEndsAt: Date | null;
}): number | null {
  if (!product.priceCents) return null;

  const now = new Date();
  const promoActive =
    product.salePriceCents &&
    product.salePriceCents < product.priceCents &&
    (!product.saleEndsAt || product.saleEndsAt > now);

  return promoActive ? product.salePriceCents! : product.priceCents;
}

export async function createPaymentIntentAction(formData: FormData) {
  const firstName = String(formData.get("firstName") || "");
  const lastName = String(formData.get("lastName") || "");
  const email = String(formData.get("email") || "");
  const phone = String(formData.get("phone") || "");
  const address = String(formData.get("address") || "");
  const postalCode = String(formData.get("postalCode") || "");
  const city = String(formData.get("city") || "");
  const country = String(formData.get("country") || "");
  const notes = String(formData.get("notes") || "");
  const itemsRaw = String(formData.get("items") || "[]");

  let items: CheckoutItem[] = [];
  try {
    const parsed: unknown = JSON.parse(itemsRaw);
    if (Array.isArray(parsed)) items = parsed as CheckoutItem[];
  } catch {
    redirect("/cart");
  }

  if (
    !firstName.trim() ||
    !email.includes("@") ||
    items.length === 0 ||
    items.some(
      (item) =>
        typeof item.slug !== "string" ||
        !item.slug ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20
    )
  ) {
    redirect("/checkout");
  }

  const requestedItems = Array.from(
    items.reduce((bySlug, item) => {
      bySlug.set(item.slug, (bySlug.get(item.slug) || 0) + item.quantity);
      return bySlug;
    }, new Map<string, number>())
  ).map(([slug, quantity]) => ({ slug, quantity }));

  if (requestedItems.some((item) => item.quantity > 20)) redirect("/cart");

  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: requestedItems.map((item) => item.slug),
      },
      status: "AVAILABLE",
    },
  });

  const orderItems = requestedItems
    .map((item) => {
      const product = products.find((p) => p.slug === item.slug);

      if (!product) return null;

      // Preço com promoção aplicada (servidor)
      const unitCents = getUnitCents(product);
      if (!unitCents) return null;

      if (product.stock < item.quantity) return null;

      return {
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitCents,
      };
    })
    .filter(Boolean) as {
    productId: string;
    name: string;
    quantity: number;
    unitCents: number;
  }[];

  if (orderItems.length !== requestedItems.length) {
    redirect("/cart");
  }

  const totalCents = orderItems.reduce((total, item) => {
    return total + item.unitCents * item.quantity;
  }, 0);

  const existingCustomer = await prisma.customerUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  const order = await prisma.order.create({
    data: {
      customerName: `${firstName} ${lastName}`.trim(),
      customerEmail: email,
      customerPhone: phone,
      address,
      postalCode,
      city,
      country,
      notes,
      totalCents,
      customerUserId: existingCustomer?.id,
      items: { create: orderItems },
    },
  });

  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "eur",
      receipt_email: email,
      metadata: { orderId: order.id },
      automatic_payment_methods: { enabled: true },
    }, {
      idempotencyKey: `order-${order.id}`,
    });
  } catch (error) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    throw error;
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of orderItems) {
        const reserved = await tx.product.updateMany({
          where: {
            id: item.productId,
            status: "AVAILABLE",
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });
        if (reserved.count !== 1) throw new Error("Stock insuficiente.");
      }

      await tx.order.update({
        where: { id: order.id },
        data: { stripePaymentIntentId: paymentIntent.id },
      });
    });
  } catch {
    try {
      await stripe.paymentIntents.cancel(paymentIntent.id);
    } catch (cancelError) {
      console.error("Erro ao cancelar pagamento sem stock:", cancelError);
    }
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    redirect("/cart");
  }

  if (!paymentIntent.client_secret) {
    throw new Error("Não foi possível iniciar pagamento.");
  }

  return {
    orderId: order.id,
    clientSecret: paymentIntent.client_secret,
  };
}
