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

  const items = JSON.parse(itemsRaw) as CheckoutItem[];

  if (!firstName || !email || items.length === 0) {
    redirect("/checkout");
  }

  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: items.map((item) => item.slug),
      },
    },
  });

  const orderItems = items
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

  if (orderItems.length !== items.length) {
    redirect("/cart");
  }

  const totalCents = orderItems.reduce((total, item) => {
    return total + item.unitCents * item.quantity;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      const product = await tx.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product || product.stock < item.quantity) {
        throw new Error("Stock insuficiente.");
      }

      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const existingCustomer = await tx.customerUser.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    return tx.order.create({
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

        items: {
          create: orderItems,
        },
      },
    });
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency: "eur",
    receipt_email: email,
    metadata: {
      orderId: order.id,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      stripePaymentIntentId: paymentIntent.id,
    },
  });

  if (!paymentIntent.client_secret) {
    throw new Error("Não foi possível iniciar pagamento.");
  }

  return {
    orderId: order.id,
    clientSecret: paymentIntent.client_secret,
  };
}