import { unstable_cache } from "next/cache";
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
  features: { title: string; text: string }[];
  trustItems: { label: string; value: string }[];
  warranty?: string;
  compatibility?: string;
};

function mapStatus(status: ProductStatus): StoreProduct["status"] {
  if (status === "AVAILABLE") return "available";
  if (status === "COMING_SOON") return "coming-soon";
  return "draft";
}

function safeJson<T>(value: string | null | undefined, fallback: T): T {
  try {
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

type ProductWithImages = Awaited<
  ReturnType<typeof prisma.product.findMany>
>[number] & {
  images: { url: string }[];
};

function mapProduct(product: ProductWithImages): StoreProduct {
  return {
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
    features: safeJson(product.featuresJson, []),
    trustItems: safeJson(product.trustItemsJson, []),
    warranty: product.warranty ?? undefined,
    compatibility: product.compatibility ?? undefined,
  };
}

export const getProducts = unstable_cache(
  async (): Promise<StoreProduct[]> => {
    const products = await prisma.product.findMany({
      where: {
        status: {
          not: "DRAFT",
        },
      },
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

    return products.map(mapProduct);
  },
  ["products"],
  {
    revalidate: 60,
  }
);

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: {
        not: "DRAFT",
      },
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  return product ? mapProduct(product) : null;
}