"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendCustomerVerificationEmail } from "@/lib/email";

export type RegisterState = {
  error?: string;
} | null;

// Valida a password. Devolve mensagem de erro, ou null se estiver ok.
function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "A password deve ter pelo menos 8 caracteres.";
  }
  if (!/[a-zA-Z]/.test(password)) {
    return "A password deve conter pelo menos uma letra.";
  }
  if (!/[0-9]/.test(password)) {
    return "A password deve conter pelo menos um número.";
  }
  return null;
}

export async function customerRegisterAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = String(formData.get("name") || "").trim();

  const email = String(formData.get("email") || "")
    .toLowerCase()
    .trim();

  const password = String(formData.get("password") || "");

  if (!email) {
    return { error: "Indica um email válido." };
  }
  if (!email.includes("@")) {
    return { error: "O email não parece válido." };
  }

  // Requisitos da password
  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  const existingCustomer = await prisma.customerUser.findUnique({
    where: { email },
  });

  if (existingCustomer) {
    return { error: "Já existe uma conta com este email. Tenta entrar." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const token = crypto.randomBytes(32).toString("hex");

  const customer = await prisma.customerUser.create({
    data: {
      name,
      email,
      passwordHash,
      emailVerificationToken: token,
      emailVerificationExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationUrl = `${appUrl}/account/verify-email?token=${token}`;

  try {
    await sendCustomerVerificationEmail({
      customerName: customer.name || "",
      customerEmail: customer.email,
      verificationUrl,
    });
  } catch (e) {
    console.error("Erro a enviar email de verificação:", e);
  }

  redirect("/account/check-email");
}