"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createCustomerSession } from "@/lib/auth/customer-session";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function accountLoginAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .toLowerCase()
    .trim();

  const password = String(formData.get("password") || "");

  if (!email || !password) {
    await delay(800);
    redirect("/account/login");
  }

  const customer = await prisma.customerUser.findUnique({
    where: { email },
  });

  if (!customer) {
    await delay(1200);
    redirect("/account/login");
  }

  const validCustomerPassword = await bcrypt.compare(
    password,
    customer.passwordHash
  );

  if (!validCustomerPassword) {
    await delay(1200);
    redirect("/account/login");
  }

  // Bloquear login se o email ainda não foi confirmado
  if (!customer.emailVerifiedAt) {
    redirect("/account/check-email");
  }

  await createCustomerSession({
    customerId: customer.id,
    email: customer.email,
  });

  redirect("/account");
}
