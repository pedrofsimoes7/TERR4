"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function parseLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseLabelValueLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");

      return {
        label: label?.trim() || "",
        value: rest.join(":").trim(),
      };
    })
    .filter((item) => item.label && item.value);
}

function parseFeatureLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split(":");

      return {
        title: title?.trim() || "",
        text: rest.join(":").trim(),
      };
    })
    .filter((item) => item.title && item.text);
}

function parseImageUrls(formData: FormData) {
  const imageCount = Number(formData.get("imageCount") || 0);

  return Array.from({ length: imageCount })
    .map((_, index) => String(formData.get(`imageUrl_${index}`) || "").trim())
    .filter(Boolean);
}

export async function updateProductAction(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const price = Number(formData.get("price") || 0);
  const stock = Number(formData.get("stock") || 0);
  const status = String(formData.get("status") || "DRAFT") as ProductStatus;
  const shortDescription = String(formData.get("shortDescription") || "").trim();
  const description = String(formData.get("description") || "").trim();

  const specs = parseLabelValueLines(String(formData.get("specs") || ""));
  const included = parseLines(String(formData.get("included") || ""));
  const features = parseFeatureLines(String(formData.get("features") || ""));
  const trustItems = parseLabelValueLines(String(formData.get("trustItems") || ""));
  const warranty = String(formData.get("warranty") || "").trim();
  const compatibility = String(formData.get("compatibility") || "").trim();
  const imageUrls = parseImageUrls(formData);

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      category,
      priceCents: price > 0 ? Math.round(price * 100) : null,
      stock,
      status,
      shortDescription,
      description,
      specsJson: JSON.stringify(specs),
      includedJson: JSON.stringify(included),
      featuresJson: JSON.stringify(features),
      trustItemsJson: JSON.stringify(trustItems),
      warranty: warranty || null,
      compatibility: compatibility || null,
    },
  });

  if (imageUrls.length > 0) {
    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    await prisma.productImage.createMany({
      data: imageUrls.map((url, index) => ({
        productId: id,
        url,
        alt: name,
        sortOrder: index,
      })),
    });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${product.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);

  redirect("/admin/products");
}