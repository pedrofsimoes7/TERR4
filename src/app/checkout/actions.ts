"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type CheckoutItem = {
  slug: string;
  quantity: number;
};

export async function createOrderAction(formData: FormData) {
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

      if (!product || !product.priceCents) return null;
      if (product.stock < item.quantity) return null;

      return {
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitCents: product.priceCents,
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
        where: { id: item.productId },
      });

      if (!product || product.stock < item.quantity) {
        throw new Error("Stock insuficiente.");
      }

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

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
        items: {
          create: orderItems,
        },
      },
    });
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    success_url: `${appUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cart`,
    metadata: {
      orderId: order.id,
    },
    line_items: orderItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        unit_amount: item.unitCents,
        product_data: {
          name: item.name,
        },
      },
    })),
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      stripeCheckoutSessionId: checkoutSession.id,
    },
  });

  if (!checkoutSession.url) {
    redirect("/checkout");
  }

  redirect(checkoutSession.url);
}