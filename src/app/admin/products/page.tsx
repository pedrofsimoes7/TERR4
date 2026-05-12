import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { activateProductAction, archiveProductAction } from "./actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Admin
            </p>
            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Produtos
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold text-white/70 hover:bg-white hover:text-neutral-950"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products/new"
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-neutral-950 hover:bg-stone-200"
            >
              Novo produto
            </Link>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
          <div className="hidden grid-cols-[1fr_120px_120px_160px] gap-4 border-b border-white/10 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white/35 md:grid">
            <span>Produto</span>
            <span>Preço</span>
            <span>Stock</span>
            <span className="text-right">Ações</span>
          </div>

          <div className="divide-y divide-white/10">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid gap-5 px-6 py-5 md:grid-cols-[1fr_120px_120px_160px] md:items-center md:gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      {product.category}
                    </p>

                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                      {product.status}
                    </span>
                  </div>

                  <h2 className="mt-2 text-xl font-black">{product.name}</h2>
                  <p className="mt-1 text-sm text-white/40">{product.slug}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 md:hidden">
                    Preço
                  </p>
                  <p className="mt-1 font-bold md:mt-0">
                    {product.priceCents
                      ? formatPrice(product.priceCents / 100)
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 md:hidden">
                    Stock
                  </p>
                  <p className="mt-1 font-bold md:mt-0">{product.stock}</p>
                </div>

                <div className="flex gap-2 md:justify-end">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-neutral-950 hover:bg-stone-200"
                  >
                    Editar
                  </Link>

                        {product.status === "DRAFT" ? (
                            <form action={activateProductAction}>
                                <input type="hidden" name="id" value={product.id} />
                                <button
                                    type="submit"
                                    className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/70 hover:bg-emerald-500 hover:text-white"
                                >
                                    Reativar
                                </button>
                            </form>
                        ) : (
                            <form action={archiveProductAction}>
                                <input type="hidden" name="id" value={product.id} />
                                <button
                                    type="submit"
                                    className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/70 hover:bg-red-500 hover:text-white"
                                >
                                    Arquivar
                                </button>
                            </form>
                        )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}