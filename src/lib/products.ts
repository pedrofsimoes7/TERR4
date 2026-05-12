import { ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type StoreProduct = {
  slug: string;
  name: string;
  category: string;
  price?: number;
  stock?: number;
  status: "available" | "coming-soon" | "draft";
  shortDescription: string;
  description: string;
  images: string[];
  specs: { label: string; value: string }[];
  included: string[];
  warranty?: string;
  compatibility?: string;
};

function mapStatus(status: ProductStatus): StoreProduct["status"] {
  if (status === "AVAILABLE") return "available";
  if (status === "COMING_SOON") return "coming-soon";
  return "draft";
}

function safeJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function getProducts(): Promise<StoreProduct[]> {
  const products = await prisma.product.findMany({
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return products.map((product) => ({
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.priceCents ? product.priceCents / 100 : undefined,
    stock: product.stock,
    status: mapStatus(product.status),
    shortDescription: product.shortDescription,
    description: product.description,
    images: product.images.map((image) => image.url),
    specs: safeJson(product.specsJson, []),
    included: safeJson(product.includedJson, []),
    warranty: product.warranty ?? undefined,
    compatibility: product.compatibility ?? undefined,
  }));
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}