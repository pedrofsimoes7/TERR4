"use server";

import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateOrderStatusAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "PENDING") as OrderStatus;

  if (!id) return;

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}