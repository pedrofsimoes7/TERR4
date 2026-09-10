import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendRentalPaymentEmail, sendRentalRejectedEmail } from "@/lib/email";
import { hashRentalToken, RENTAL_RESPONSE_WINDOW_MS } from "@/lib/rental-links";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const { token } = await params;
  const formData = await request.formData();
  const decision = String(formData.get("decision") || "");
  const redirectToDecision = (result: string) =>
    NextResponse.redirect(new URL(`/alugueres/decisao/${token}?result=${result}`, request.url), 303);

  if (decision !== "approve" && decision !== "reject") return redirectToDecision("invalid");

  const rental = await prisma.rental.findUnique({
    where: { decisionTokenHash: hashRentalToken(token) },
    include: { product: true },
  });

  if (!rental || rental.status !== "PENDING_APPROVAL") return redirectToDecision("unavailable");

  const now = new Date();
  if (!rental.decisionExpiresAt || rental.decisionExpiresAt <= now) {
    await prisma.rental.update({ where: { id: rental.id }, data: { status: "EXPIRED" } });
    return redirectToDecision("expired");
  }

  if (decision === "reject") {
    await prisma.rental.update({ where: { id: rental.id }, data: { status: "REJECTED" } });
    try {
      await sendRentalRejectedEmail({
        customerName: rental.customerName,
        customerEmail: rental.customerEmail,
        productName: rental.product.name,
        startDate: rental.startDate,
        endDate: rental.endDate,
      });
    } catch (error) {
      console.error("Erro ao enviar email de indisponibilidade:", error);
    }
    return redirectToDecision("rejected");
  }

  const paymentExpiresAt = new Date(now.getTime() + RENTAL_RESPONSE_WINDOW_MS);
  const changed = await prisma.rental.updateMany({
    where: { id: rental.id, status: "PENDING_APPROVAL" },
    data: { status: "AWAITING_PAYMENT", paymentExpiresAt },
  });
  if (changed.count !== 1) return redirectToDecision("unavailable");

  let createdSessionId: string | null = null;
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://terr4.pt";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: rental.customerEmail,
      expires_at: Math.floor(paymentExpiresAt.getTime() / 1000),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: rental.totalCents,
            product_data: {
              name: `Aluguer ${rental.product.name}`,
              description: `${rental.startDate.toLocaleDateString("pt-PT")} a ${rental.endDate.toLocaleDateString("pt-PT")}`,
            },
          },
        },
      ],
      metadata: { rentalId: rental.id, paymentType: "rental" },
      payment_intent_data: {
        metadata: { rentalId: rental.id, paymentType: "rental" },
        receipt_email: rental.customerEmail,
      },
      success_url: `${appUrl}/alugueres/pagamento-confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/alugueres`,
    }, {
      idempotencyKey: `rental-${rental.id}-${paymentExpiresAt.getTime()}`,
    });

    if (!session.url) throw new Error("A Stripe não devolveu um link de pagamento.");
    createdSessionId = session.id;

    await prisma.rental.update({
      where: { id: rental.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    await sendRentalPaymentEmail({
      customerName: rental.customerName,
      customerEmail: rental.customerEmail,
      productName: rental.product.name,
      startDate: rental.startDate,
      endDate: rental.endDate,
      total: rental.totalCents,
      paymentUrl: session.url,
      expiresAt: paymentExpiresAt,
    });

    return redirectToDecision("payment-sent");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Erro ao criar pagamento do aluguer:", { rentalId: rental.id, message, error });
    if (createdSessionId) {
      try {
        await stripe.checkout.sessions.expire(createdSessionId);
      } catch (expireError) {
        console.error("Erro ao expirar a sessão Stripe sem email:", expireError);
      }
    }
    try {
      await prisma.rental.update({
        where: { id: rental.id },
        data: {
          status: "PENDING_APPROVAL",
          paymentExpiresAt: null,
          stripeCheckoutSessionId: null,
        },
      });
    } catch (rollbackError) {
      console.error("Erro ao repor o pedido de aluguer:", rollbackError);
    }
    return redirectToDecision("error");
  }
}
