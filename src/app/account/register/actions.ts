"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendCustomerVerificationEmail } from "@/lib/email";

export async function customerRegisterAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();

  const email = String(formData.get("email") || "")
    .toLowerCase()
    .trim();

  const password = String(formData.get("password") || "");

  if (!email || !password || password.length < 6) {
    redirect("/account/register");
  }

  const existingCustomer = await prisma.customerUser.findUnique({
    where: { email },
  });

  if (existingCustomer) {
    redirect("/account/login");
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

  await sendCustomerVerificationEmail({
    customerName: customer.name || "",
    customerEmail: customer.email,
    verificationUrl,
  });

  redirect("/account/check-email");
}