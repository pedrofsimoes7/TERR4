import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, title, body: reviewBody, rating } = body;

    if (!customerName || !reviewBody || !rating) {
      return NextResponse.json({ error: "Dados em falta" }, { status: 400 });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: "Classificação inválida" }, { status: 400 });
    }

    await prisma.review.create({
      data: {
        customerName: String(customerName).trim().slice(0, 80),
        title: title ? String(title).trim().slice(0, 120) : null,
        body: String(reviewBody).trim().slice(0, 2000),
        rating: numRating,
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Erro do servidor" }, { status: 500 });
  }
}