import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRentalRequestEmail, sendAdminNewRentalEmail } from "@/lib/email";

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
      totalCents,
      depositCents,
    } = body;

    if (!productId || !startDate || !endDate || !customerName || !customerEmail) {
      return NextResponse.json({ error: "Dados em falta" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return NextResponse.json({ error: "Datas inválidas" }, { status: 400 });
    }

    const conflict = await prisma.rental.findFirst({
      where: {
        productId,
        status: { in: ["PENDING", "APPROVED"] },
        startDate: { lte: end },
        endDate: { gte: start },
      },
    });

    if (conflict) {
      return NextResponse.json({ error: "Essas datas já estão reservadas" }, { status: 409 });
    }

    const rental = await prisma.rental.create({
      data: {
        productId,
        startDate: start,
        endDate: end,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        notes: notes || null,
        totalCents: totalCents || 0,
        depositCents: depositCents || 0,
        status: "PENDING",
      },
      include: { product: true },
    });

    // Emails — não bloqueiam a resposta se falharem
    try {
      await Promise.all([
        sendRentalRequestEmail({
          customerName,
          customerEmail,
          productName: rental.product.name,
          startDate: start,
          endDate: end,
          total: rental.totalCents,
          deposit: rental.depositCents,
        }),
        sendAdminNewRentalEmail({
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
          productName: rental.product.name,
          startDate: start,
          endDate: end,
          total: rental.totalCents,
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