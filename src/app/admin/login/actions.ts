"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .toLowerCase()
    .trim();

  const password = String(formData.get("password") || "");

  if (!email || !password) {
    await delay(800);
    redirect("/admin/login");
  }

  const admin = await prisma.adminUser.findUnique({
    where: {
      email,
    },
  });

  if (!admin) {
    await delay(1200);
    redirect("/admin/login");
  }

  const validPassword = await bcrypt.compare(
    password,
    admin.passwordHash
  );

  if (!validPassword) {
    await delay(1200);
    redirect("/admin/login");
  }

  await createSession({
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  });

  redirect("/admin");
}