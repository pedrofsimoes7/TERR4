import { unstable_cache } from "next/cache";
import { ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type StoreProduct = {
  slug: string;
  name: string;
  category: string;
  price?: number;
  salePrice?: number;        // preço promocional (se houver promo ativa)
  saleEndsAt?: Date;         // quando acaba a promo
  discountPercent?: number;  // % de desconto (calculada)
  onSale: boolean;           // true se há promo ativa agora
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
  // Regra automática: sem stock => "brevemente"
  let status = mapStatus(product.status);
  if (status === "available" && (product.stock ?? 0) <= 0) {
    status = "coming-soon";
  }

  const price = product.priceCents ? product.priceCents / 100 : undefined;

  // ── Promoção ativa? ──
  // Há promo se existe salePriceCents E a data de fim ainda não passou.
  let salePrice: number | undefined;
  let saleEndsAt: Date | undefined;
  let discountPercent: number | undefined;
  let onSale = false;

  const now = new Date();
  if (
    product.salePriceCents &&
    product.priceCents &&
    product.salePriceCents < product.priceCents &&
    (!product.saleEndsAt || product.saleEndsAt > now)
  ) {
    onSale = true;
    salePrice = product.salePriceCents / 100;
    saleEndsAt = product.saleEndsAt ?? undefined;
    discountPercent = Math.round(
      ((product.priceCents - product.salePriceCents) / product.priceCents) * 100
    );
  }

  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    price,
    salePrice,
    saleEndsAt,
    discountPercent,
    onSale,
    stock: product.stock,
    status,
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