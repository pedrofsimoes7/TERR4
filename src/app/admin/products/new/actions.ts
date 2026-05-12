"use server";

import { ProductStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createProductAction(formData: FormData) {
  const name = String(formData.get("name") || "");
  const slug = String(formData.get("slug") || "");
  const category = String(formData.get("category") || "");
  const price = Number(formData.get("price") || 0);
  const stock = Number(formData.get("stock") || 0);
  const status = String(formData.get("status") || "DRAFT") as ProductStatus;
  const shortDescription = String(formData.get("shortDescription") || "");
  const description = String(formData.get("description") || "");
  const imageUrl = String(formData.get("imageUrl") || "/images/hero-jeep.jpeg");

  await prisma.product.create({
    data: {
      name,
      slug,
      category,
      priceCents: price > 0 ? Math.round(price * 100) : null,
      stock,
      status,
      shortDescription,
      description,
      specsJson: "[]",
      includedJson: "[]",
      images: {
        create: [{ url: imageUrl, alt: name, sortOrder: 0 }],
      },
    },
  });

  redirect("/admin/products");
}