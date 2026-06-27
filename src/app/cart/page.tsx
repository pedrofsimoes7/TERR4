"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, ArrowUpRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import type { StoreProduct } from "@/lib/products";

// Preço efetivo: promoção se ativa, senão normal.
// Mesma regra do checkout e do servidor.
function effectivePrice(product: StoreProduct): number {
  if (product.onSale && product.salePrice) return product.salePrice;
  return product.price || 0;
}

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);

  const total = items.reduce((acc, item) => {
    return acc + effectivePrice(item.product) * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <main className="min-h-[100dvh] bg-[#070706] px-6 pb-28 pt-40 text-white">
        <section className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] animate-pulse [animation-duration:2.5s]">
            <ShoppingBag size={30} className="text-[#a79d8d]" />
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.9] tracking-[-0.04em] md:text-7xl">
            Carrinho vazio.
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-[#c8c4be]/55">
            Ainda não adicionaste nenhum produto. Explora o equipamento TERR4.
          </p>

          <Link
            href="/shop"
            className="btn-wipe group mt-10 inline-flex h-13 items-center gap-3 rounded-full bg-[#f4efe4] px-8 text-sm font-black uppercase tracking-[0.1em] text-neutral-950 transition duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            Ver produtos
            <ArrowUpRight size={15} className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-[#070706] px-6 pb-28 pt-40 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
            Carrinho
          </p>
          <h1 className="mt-4 text-6xl font-black leading-[0.9] tracking-[-0.04em] md:text-8xl">
            A tua seleção.
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => {
              const unit = effectivePrice(item.product);
              const onSale = item.product.onSale && item.product.salePrice;
              return (
                <div
                  key={item.product.slug}
                  className="group flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-white/20 sm:flex-row"
                >
                  <div className="overflow-hidden rounded-[1.5rem] bg-[#151411]">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={260}
                      height={200}
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:w-[200px]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#a79d8d]">
                          {item.product.category}
                        </p>
                        {onSale && (
                          <span className="rounded-full bg-[#c46a2d] px-2 py-0.5 text-[10px] font-black text-white">
                            -{item.product.discountPercent}%
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 text-2xl font-black text-white">
                        {item.product.name}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-[#c8c4be]/55">
                        {item.product.shortDescription}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
                        <button
                          type="button"
                          onClick={() => decreaseItem(item.product.slug)}
                          className="flex size-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white hover:text-neutral-950"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="min-w-6 text-center text-sm font-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem(item.product)}
                          className="flex size-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white hover:text-neutral-950"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-black">
                            {formatPrice(unit * item.quantity)}
                          </p>
                          {onSale && (
                            <p className="text-xs font-bold text-white/35 line-through">
                              {formatPrice((item.product.price || 0) * item.quantity)}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.slug)}
                          className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-7 lg:sticky lg:top-28">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a79d8d]">
              Resumo
            </p>

            <div className="mt-6 space-y-3 border-b border-white/10 pb-6">
              {items.map((item) => (
                <div key={item.product.slug} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#c8c4be]/60">
                    {item.product.name} ×{item.quantity}
                  </span>
                  <span className="text-sm font-bold">
                    {formatPrice(effectivePrice(item.product) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[#c8c4be]/60">Total</span>
              <span className="text-3xl font-black text-white">{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              className="btn-wipe group mt-7 flex h-13 w-full items-center justify-center gap-3 rounded-full bg-[#f4efe4] text-sm font-black uppercase tracking-[0.1em] text-neutral-950 transition duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-[0.97]"
            >
              Continuar para checkout
              <ArrowUpRight size={15} className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <p className="mt-4 text-center text-xs text-[#c8c4be]/30">
              Pagamento seguro via Stripe
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}