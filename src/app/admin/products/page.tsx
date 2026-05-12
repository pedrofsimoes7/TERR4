import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Admin
            </p>
            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Produtos
            </h1>
          </div>

          <Link
            href="/admin"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold text-white/70 hover:bg-white hover:text-neutral-950"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
          <div className="grid grid-cols-[1fr_120px_120px_140px] gap-4 border-b border-white/10 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
            <span>Produto</span>
            <span>Preço</span>
            <span>Stock</span>
            <span className="text-right">Ações</span>
          </div>

          <div className="divide-y divide-white/10">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[1fr_120px_120px_140px] items-center gap-4 px-6 py-5"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    {product.category}
                  </p>
                  <h2 className="mt-2 text-xl font-black">{product.name}</h2>
                  <p className="mt-1 text-sm text-white/40">{product.slug}</p>
                </div>

                <p className="font-bold">
                  {product.priceCents
                    ? formatPrice(product.priceCents / 100)
                    : "—"}
                </p>

                <p className="font-bold">{product.stock}</p>

                <div className="text-right">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="rounded-full bg-white px-4 py-2 text-sm font-bold text-neutral-950 hover:bg-stone-200"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}