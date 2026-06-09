"use server";

import { ProductStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export async function createProductAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const price = Number(formData.get("price") || 0);
  const stock = Number(formData.get("stock") || 0);
  const status = String(formData.get("status") || "DRAFT") as ProductStatus;
  const shortDescription = String(formData.get("shortDescription") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "/images/hero-jeep.jpeg").trim();

  const specs = parseLabelValueLines(String(formData.get("specs") || ""));
  const included = parseLines(String(formData.get("included") || ""));
  const features = parseFeatureLines(String(formData.get("features") || ""));
  const trustItems = parseLabelValueLines(String(formData.get("trustItems") || ""));
  const warranty = String(formData.get("warranty") || "").trim();
  const compatibility = String(formData.get("compatibility") || "").trim();

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
      specsJson: JSON.stringify(specs),
      includedJson: JSON.stringify(included),
      featuresJson: JSON.stringify(features),
      trustItemsJson: JSON.stringify(trustItems),
      warranty: warranty || null,
      compatibility: compatibility || null,
      images: {
        create: [{ url: imageUrl, alt: name, sortOrder: 0 }],
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  redirect("/admin/products");
}