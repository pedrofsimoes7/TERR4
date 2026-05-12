import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProductAction } from "./actions";
import { ProductForm } from "./product-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({
  params,
}: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!product) notFound();

  const mainImage =
    product.images[0]?.url ?? "/images/hero-jeep.jpeg";

  const updateWithId = updateProductAction.bind(
    null,
    product.id
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/admin/products"
          className="text-sm font-bold text-white/55 hover:text-white"
        >
          ← Voltar aos produtos
        </Link>

        <p className="mt-10 text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          Admin
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight">
          Editar produto.
        </h1>

        <ProductForm
          product={product}
          mainImage={mainImage}
          updateAction={updateWithId}
        />
      </section>
    </main>
  );
}