"use server";

import { redirect } from "next/navigation";
import { destroyCustomerSession } from "@/lib/auth/customer-session";

export async function customerLogoutAction() {
  await destroyCustomerSession();

  redirect("/account/login");
}