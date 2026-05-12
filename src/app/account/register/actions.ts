"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createCustomerSession } from "@/lib/auth/customer-session";

export async function customerRegisterAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();

  const email = String(formData.get("email") || "")
    .toLowerCase()
    .trim();

  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/account/register");
  }

  const existingCustomer = await prisma.customerUser.findUnique({
    where: {
      email,
    },
  });

  if (existingCustomer) {
    redirect("/account/login");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const customer = await prisma.$transaction(async (tx) => {
    const createdCustomer = await tx.customerUser.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    await tx.order.updateMany({
      where: {
        customerEmail: email,
        customerUserId: null,
      },
      data: {
        customerUserId: createdCustomer.id,
      },
    });

    return createdCustomer;
  });

  await createCustomerSession({
    customerId: customer.id,
    email: customer.email,
  });

  redirect("/account");
}