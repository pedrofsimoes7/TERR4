import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendStockReservationEmail,
  sendAdminNewReservationEmail,
} from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productSlug = String(body.productSlug || "").trim();
    const customerName = String(body.customerName || "").trim();
    const customerEmail = String(body.customerEmail || "").trim();

    if (!productSlug || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Dados em falta." },
        { status: 400 }
      );
    }

    if (!customerEmail.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: { slug: productSlug },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    // upsert: se já existe reserva deste email para este produto, reativa-a;
    // senão cria nova. Evita duplicados e erros de unique.
    await prisma.stockReservation.upsert({
      where: {
        productId_customerEmail: {
          productId: product.id,
          customerEmail,
        },
      },
      update: {
        customerName,
        status: "WAITING",
        notifiedAt: null,
      },
      create: {
        productId: product.id,
        customerName,
        customerEmail,
        status: "WAITING",
      },
    });

    // Email ao cliente (confirmação) + ao admin (aviso). Não falha a reserva
    // se o email der erro.
    try {
      await sendStockReservationEmail({
        customerName,
        customerEmail,
        productName: product.name,
      });
      await sendAdminNewReservationEmail({
        customerName,
        customerEmail,
        productName: product.name,
      });
    } catch (e) {
      console.error("Erro a enviar emails de reserva:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao criar reserva:", e);
    return NextResponse.json(
      { error: "Erro ao processar a reserva." },
      { status: 500 }
    );
  }
}