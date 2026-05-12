"use server";

import { redirect } from "next/navigation";
import { createSession } from "@/lib/auth/session";

export async function loginAction(formData: FormData) {
  const password = formData.get("password");

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login");
  }

  await createSession();

  redirect("/admin");
}