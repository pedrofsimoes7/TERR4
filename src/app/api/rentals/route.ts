import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCompanyRentalDecisionEmail, sendRentalRequestEmail } from "@/lib/email";
import {
  createRentalDecisionToken,
  hashRentalToken,
  RENTAL_RESPONSE_WINDOW_MS,
} from "@/lib/rental-links";

const RENTAL_SLUG = "terr4-start";
const DAILY_RENTAL_CENTS = 4_000;
const DEPOSIT_CENTS = 40_000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      productId,
      startDate,
      endDate,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    } = body;

    if (!productId || !startDate || !endDate || !customerName || !customerEmail) {
      return NextResponse.json({ error: "Dados em falta" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return NextResponse.json({ error: "Datas inválidas" }, { status: 400 });
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, slug: RENTAL_SLUG },
    });

    if (!product) {
      return NextResponse.json({ error: "Aluguer indisponível" }, { status: 404 });
    }

    const now = new Date();
    const conflict = await prisma.rental.findFirst({
      where: {
        productId,
        startDate: { lte: end },
        endDate: { gte: start },
        OR: [
          { status: "PAID" },
          { status: "PENDING_APPROVAL", decisionExpiresAt: { gt: now } },
          { status: "AWAITING_PAYMENT", paymentExpiresAt: { gt: now } },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json({ error: "Essas datas já estão reservadas" }, { status: 409 });
    }

    const days = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;
    const totalCents = days * DAILY_RENTAL_CENTS;
    const decisionToken = createRentalDecisionToken();
    const decisionExpiresAt = new Date(now.getTime() + RENTAL_RESPONSE_WINDOW_MS);

    const rental = await prisma.rental.create({
      data: {
        productId,
        startDate: start,
        endDate: end,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        notes: notes || null,
        totalCents,
        depositCents: DEPOSIT_CENTS,
        status: "PENDING_APPROVAL",
        decisionTokenHash: hashRentalToken(decisionToken),
        decisionExpiresAt,
      },
      include: { product: true },
    });

    // Emails — não bloqueiam a resposta se falharem
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://terr4.pt";
      await Promise.all([
        sendRentalRequestEmail({
          customerName,
          customerEmail,
          productName: rental.product.name,
          startDate: start,
          endDate: end,
          total: rental.totalCents,
          deposit: rental.depositCents,
          expiresAt: decisionExpiresAt,
        }),
        sendCompanyRentalDecisionEmail({
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
          productName: rental.product.name,
          startDate: start,
          endDate: end,
          total: rental.totalCents,
          decisionUrl: `${appUrl}/alugueres/decisao/${decisionToken}`,
          expiresAt: decisionExpiresAt,
        }),
      ]);
    } catch (emailError) {
      console.error("Erro ao enviar emails de aluguer:", emailError);
    }

    return NextResponse.json({ ok: true, id: rental.id });
  } catch (error) {
    console.error("Rental creation error:", error);
    return NextResponse.json({ error: "Erro do servidor" }, { status: 500 });
  }
}
