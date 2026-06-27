"use server";

import { ProductStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { broadcastNewProduct } from "@/lib/marketing";

function parseLines(value: string) {
  return value.split("\n").map((l) => l.trim()).filter(Boolean);
}

function parseLabelValueLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return { label: label?.trim() || "", value: rest.join(":").trim() };
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
      return { title: title?.trim() || "", text: rest.join(":").trim() };
    })
    .filter((item) => item.title && item.text);
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
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

  const imageCount = Number(formData.get("imageCount") || 0);
  const imageUrls: string[] = [];
  for (let i = 0; i < imageCount; i++) {
    const url = String(formData.get(`imageUrl_${i}`) || "").trim();
    if (url) imageUrls.push(url);
  }

  if (imageUrls.length === 0) {
    imageUrls.push("/images/hero-jeep.jpeg");
  }

  const priceCents = price > 0 ? Math.round(price * 100) : null;

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      category,
      priceCents,
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
        create: imageUrls.map((url, index) => ({
          url,
          alt: name,
          sortOrder: index,
        })),
      },
    },
  });

  // ── Email "produto novo" — só se for criado como AVAILABLE ──
  if (status === "AVAILABLE") {
    try {
      await broadcastNewProduct({
        productName: product.name,
        productSlug: product.slug,
        priceCents: product.priceCents,
        shortDescription: product.shortDescription,
      });
    } catch (e) {
      console.error("Erro ao enviar email de produto novo:", e);
    }
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  redirect("/admin/products");
}