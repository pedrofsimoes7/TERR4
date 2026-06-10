"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";
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

  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (admin) {
    const validAdminPassword = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!validAdminPassword) {
      await delay(1200);
      redirect("/account/login");
    }

    await createSession({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    redirect("/admin");
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

  await createCustomerSession({
    customerId: customer.id,
    email: customer.email,
  });

  redirect("/account");
}