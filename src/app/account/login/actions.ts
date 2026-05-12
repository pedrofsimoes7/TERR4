"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createCustomerSession } from "@/lib/auth/customer-session";

export async function customerLoginAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .toLowerCase()
    .trim();

  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/account/login");
  }

  const customer = await prisma.customerUser.findUnique({
    where: {
      email,
    },
  });

  if (!customer) {
    redirect("/account/login");
  }

  const validPassword = await bcrypt.compare(
    password,
    customer.passwordHash
  );

  if (!validPassword) {
    redirect("/account/login");
  }

  await createCustomerSession({
    customerId: customer.id,
    email: customer.email,
  });

  redirect("/account");
}