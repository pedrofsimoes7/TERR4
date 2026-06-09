import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendOrderPaidEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json({ received: true });
    }

    const alreadyPaid = existingOrder.status === "PAID";
    const alreadySentEmail = Boolean(existingOrder.invoiceSentAt);

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paidAt: existingOrder.paidAt ?? new Date(),
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    if (!alreadyPaid && !alreadySentEmail) {
      try {
        const emailId = await sendOrderPaidEmail({
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          orderId: order.id,
          total: order.totalCents,
        });

        await prisma.order.update({
          where: { id: order.id },
          data: {
            invoiceSentAt: new Date(),
            invoiceEmailId: emailId,
          },
        });
      } catch (error) {
        console.error("Failed to send order paid email:", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}