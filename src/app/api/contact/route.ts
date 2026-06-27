import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customerName = String(body.customerName || "").trim();
    const customerEmail = String(body.customerEmail || "").trim();
    const vehicle = String(body.vehicle || "").trim();
    const message = String(body.message || "").trim();

    // Campos obrigatórios
    if (!customerName || !customerEmail || !message) {
      return NextResponse.json(
        { error: "Preenche o nome, email e mensagem." },
        { status: 400 }
      );
    }

    if (!customerEmail.includes("@")) {
      return NextResponse.json(
        { error: "O email não parece válido." },
        { status: 400 }
      );
    }

    await sendContactEmail({
      customerName,
      customerEmail,
      vehicle: vehicle || undefined,
      message,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao enviar mensagem de contacto:", e);
    return NextResponse.json(
      { error: "Não foi possível enviar a mensagem. Tenta novamente." },
      { status: 500 }
    );
  }
}