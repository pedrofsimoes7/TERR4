"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function updateProductAction(id: string, formData: FormData) {
  const name = String(formData.get("name") || "");
  const category = String(formData.get("category") || "");
  const price = Number(formData.get("price") || 0);
  const stock = Number(formData.get("stock") || 0);
  const status = String(formData.get("status") || "DRAFT") as ProductStatus;
  const shortDescription = String(formData.get("shortDescription") || "");
  const description = String(formData.get("description") || "");
  const imageUrl = String(formData.get("imageUrl") || "");

  await prisma.product.update({
    where: { id },
    data: {
      name,
      category,
      priceCents: price > 0 ? Math.round(price * 100) : null,
      stock,
      status,
      shortDescription,
      description,
    },
  });

  if (imageUrl) {
    const existingImage = await prisma.productImage.findFirst({
      where: {
        productId: id,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    if (existingImage) {
      await prisma.productImage.update({
        where: {
          id: existingImage.id,
        },
        data: {
          url: imageUrl,
          alt: name,
        },
      });
    } else {
      await prisma.productImage.create({
        data: {
          productId: id,
          url: imageUrl,
          alt: name,
          sortOrder: 0,
        },
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${id}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  redirect("/admin/products");
}