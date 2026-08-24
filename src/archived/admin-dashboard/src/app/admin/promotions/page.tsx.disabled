import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth/require-admin";
import { PromotionForm } from "@/components/admin/promotion-form";
import { endPromotionAction } from "./actions";

export const dynamic = "force-dynamic";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminPromotionsPage() {
  await requireAdmin();

  const now = new Date();

  const [allProducts, marketingCount] = await Promise.all([
    prisma.product.findMany({
      where: { status: { not: "DRAFT" } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customerUser.count({
      where: { marketingConsent: true, emailVerifiedAt: { not: null } },
    }),
  ]);

  // Produtos com promoção ativa
  const activePromos = allProducts.filter(
    (p) =>
      p.salePriceCents &&
      p.priceCents &&
      p.salePriceCents < p.priceCents &&
      (!p.saleEndsAt || p.saleEndsAt > now)
  );

  // Produtos elegíveis para promoção (têm preço e não estão já em promo)
  const eligibleProducts = allProducts
    .filter((p) => p.priceCents && !activePromos.find((ap) => ap.id === p.id))
    .map((p) => ({ id: p.id, name: p.name, priceCents: p.priceCents }));

  return (
    <main className="min-h-[100dvh] bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Admin
            </p>
            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Promoções
            </h1>
            <p className="mt-4 text-sm text-white/45">
              {activePromos.length} promoç{activePromos.length === 1 ? "ão ativa" : "ões ativas"}
              {" · "}
              {marketingCount} cliente{marketingCount === 1 ? "" : "s"} subscrito{marketingCount === 1 ? "" : "s"} a marketing
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-bold text-white/70 transition hover:bg-white hover:text-neutral-950"
          >
            Dashboard
          </Link>
        </div>

        {/* Criar promoção */}
        <div className="mt-12">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">
            Nova promoção
          </h2>
          <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
            {eligibleProducts.length === 0 ? (
              <p className="text-sm text-white/45">
                Não há produtos elegíveis. Todos os produtos com preço já estão
                em promoção, ou não tens produtos com preço definido.
              </p>
            ) : (
              <PromotionForm products={eligibleProducts} />
            )}
          </div>
        </div>

        {/* Promoções ativas */}
        <div className="mt-12">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">
            Promoções ativas
          </h2>

          {activePromos.length === 0 ? (
            <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">
              <p className="text-white/45">Não há promoções ativas neste momento.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {activePromos.map((p) => {
                const discount = Math.round(
                  ((p.priceCents! - p.salePriceCents!) / p.priceCents!) * 100
                );
                return (
                  <article
                    key={p.id}
                    className="rounded-[1.75rem] border border-[#c46a2d]/30 bg-[#c46a2d]/[0.06] p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                          {p.category}
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-white">
                          {p.name}
                        </h3>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#c46a2d] px-3 py-1.5 text-sm font-black text-white">
                        -{discount}%
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline gap-3">
                      <span className="text-2xl font-black text-white">
                        {formatPrice(p.salePriceCents! / 100)}
                      </span>
                      <span className="text-lg font-bold text-white/35 line-through">
                        {formatPrice(p.priceCents! / 100)}
                      </span>
                    </div>

                    {p.saleEndsAt && (
                      <p className="mt-3 text-sm text-white/50">
                        Termina em {formatDateTime(p.saleEndsAt)}
                      </p>
                    )}

                    <form action={endPromotionAction} className="mt-5">
                      <input type="hidden" name="productId" value={p.id} />
                      <button className="flex h-10 w-full items-center justify-center rounded-full border border-white/15 text-sm font-bold text-white/70 transition hover:bg-red-500 hover:text-white">
                        Terminar promoção
                      </button>
                    </form>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}