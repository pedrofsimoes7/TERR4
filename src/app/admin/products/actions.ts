"use server";

import { ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function archiveProductAction(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) return;

  await prisma.product.update({
    where: { id },
    data: {
      status: ProductStatus.DRAFT,
    },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}