import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  sendOrderPaidEmail,
  sendCompanyNewOrderEmail,
  sendCompanyRentalPaidEmail,
  sendRentalPaidEmail,
} from "@/lib/email";

function received(responseStatus = 200) {
  return NextResponse.json({ received: true }, { status: responseStatus });
}

async function handleRentalPayment(paymentIntent: Stripe.PaymentIntent) {
  const rentalId = paymentIntent.metadata.rentalId;
  if (!rentalId || paymentIntent.metadata.paymentType !== "rental") return false;

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { product: true },
  });
  if (!rental) return true;

  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntent.id,
    limit: 1,
  });
  const session = sessions.data[0];
  const matchesCurrentSession = session?.id === rental.stripeCheckoutSessionId;
  const amountMatches = paymentIntent.amount_received === rental.totalCents;
  const currencyMatches = paymentIntent.currency === "eur";

  if (!matchesCurrentSession || !amountMatches || !currencyMatches) {
    console.error("Pagamento de aluguer não corresponde à reserva", {
      rentalId,
      paymentIntentId: paymentIntent.id,
      matchesCurrentSession,
      amountMatches,
      currencyMatches,
    });
    return true;
  }

  if (rental.status === "AWAITING_PAYMENT") {
    await prisma.rental.updateMany({
      where: { id: rental.id, status: "AWAITING_PAYMENT" },
      data: {
        status: "PAID",
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntent.id,
      },
    });
  } else if (rental.status !== "PAID") {
    console.error("Pagamento recebido para aluguer num estado inesperado", {
      rentalId,
      status: rental.status,
      paymentIntentId: paymentIntent.id,
    });
    return true;
  }

  let emailFailed = false;

  if (!rental.customerPaidEmailSentAt) {
    try {
      await sendRentalPaidEmail({
        customerName: rental.customerName,
        customerEmail: rental.customerEmail,
        productName: rental.product.name,
        startDate: rental.startDate,
        endDate: rental.endDate,
        total: rental.totalCents,
      });
      await prisma.rental.update({
        where: { id: rental.id },
        data: { customerPaidEmailSentAt: new Date() },
      });
    } catch (error) {
      emailFailed = true;
      console.error("Failed to send rental paid email:", error);
    }
  }

  if (!rental.companyPaidEmailSentAt) {
    try {
      await sendCompanyRentalPaidEmail({
        customerName: rental.customerName,
        customerEmail: rental.customerEmail,
        customerPhone: rental.customerPhone,
        productName: rental.product.name,
        startDate: rental.startDate,
        endDate: rental.endDate,
        total: rental.totalCents,
      });
      await prisma.rental.update({
        where: { id: rental.id },
        data: { companyPaidEmailSentAt: new Date() },
      });
    } catch (error) {
      emailFailed = true;
      console.error("Failed to send company rental paid email:", error);
    }
  }

  if (emailFailed) throw new Error("Uma ou mais notificações do aluguer falharam.");
  return true;
}

async function handleOrderPayment(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  if (!orderId) return;

  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!existingOrder) return;

  if (
    paymentIntent.amount_received !== existingOrder.totalCents ||
    paymentIntent.currency !== "eur"
  ) {
    console.error("Pagamento de produto não corresponde à encomenda", {
      orderId,
      paymentIntentId: paymentIntent.id,
    });
    return;
  }

  if (existingOrder.status === "PENDING") {
    await prisma.order.updateMany({
      where: { id: orderId, status: "PENDING" },
      data: {
        status: "PAID",
        paidAt: existingOrder.paidAt ?? new Date(),
        stripePaymentIntentId: paymentIntent.id,
      },
    });
  } else if (
    !["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(existingOrder.status)
  ) {
    console.error("Pagamento recebido para encomenda num estado inesperado", {
      orderId,
      status: existingOrder.status,
      paymentIntentId: paymentIntent.id,
    });
    return;
  }

  let emailFailed = false;

  if (!existingOrder.invoiceSentAt) {
    try {
      const emailId = await sendOrderPaidEmail({
        customerName: existingOrder.customerName,
        customerEmail: existingOrder.customerEmail,
        orderId: existingOrder.id,
        total: existingOrder.totalCents,
      });
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: { invoiceSentAt: new Date(), invoiceEmailId: emailId },
      });
    } catch (error) {
      emailFailed = true;
      console.error("Failed to send order paid email:", error);
    }
  }

  if (!existingOrder.companyPaidEmailSentAt) {
    try {
      await sendCompanyNewOrderEmail({
        customerName: existingOrder.customerName,
        customerEmail: existingOrder.customerEmail,
        customerPhone: existingOrder.customerPhone,
        address: existingOrder.address,
        postalCode: existingOrder.postalCode,
        city: existingOrder.city,
        country: existingOrder.country,
        notes: existingOrder.notes,
        items: existingOrder.items,
        orderId: existingOrder.id,
        total: existingOrder.totalCents,
      });
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: { companyPaidEmailSentAt: new Date() },
      });
    } catch (error) {
      emailFailed = true;
      console.error("Failed to send company new order email:", error);
    }
  }

  if (emailFailed) throw new Error("Uma ou mais notificações da encomenda falharam.");
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook configuration" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const rentalId = session.metadata?.rentalId;
      if (rentalId) {
        await prisma.rental.updateMany({
          where: {
            id: rentalId,
            status: "AWAITING_PAYMENT",
            stripeCheckoutSessionId: session.id,
          },
          data: { status: "EXPIRED" },
        });
      }
      return received();
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const handledRental = await handleRentalPayment(paymentIntent);
      if (!handledRental) await handleOrderPayment(paymentIntent);
    }

    return received();
  } catch (error) {
    console.error("Erro ao processar webhook Stripe:", { eventId: event.id, error });
    return received(500);
  }
}
