"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);

  const total = items.reduce((acc, item) => {
    return acc + (item.product.price || 0) * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <main className="bg-neutral-950 px-6 pb-24 pt-36 text-white">
        <section className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
            Carrinho
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
            A tua seleção.
          </h1>

          <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/10">
              <ShoppingBag size={28} />
            </div>

            <h2 className="mt-6 text-2xl font-black">Carrinho vazio</h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
              Ainda não adicionaste nenhum produto.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-neutral-950 transition hover:bg-stone-200"
            >
              Ver produtos
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-neutral-950 px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Carrinho
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              A tua seleção.
            </h1>

            <div className="mt-10 space-y-5">
              {items.map((item) => (
                <div
                  key={item.product.slug}
                  className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:flex-row"
                >
                  <div className="relative overflow-hidden rounded-[1.5rem]">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={260}
                      height={200}
                      className="aspect-[4/3] w-full object-cover sm:w-[220px]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm text-white/45">
                        {item.product.category}
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        {item.product.name}
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-white/60">
                        {item.product.shortDescription}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                              <div>
                                  <p className="text-sm text-white/45">Quantidade</p>

                                  <div className="mt-2 flex items-center gap-3">
                                      <button
                                          type="button"
                                          onClick={() => decreaseItem(item.product.slug)}
                                          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white hover:text-neutral-950"
                                          aria-label="Diminuir quantidade"
                                      >
                                          <Minus size={15} />
                                      </button>

                                      <span className="min-w-6 text-center font-bold">{item.quantity}</span>

                                      <button
                                          type="button"
                                          onClick={() => addItem(item.product)}
                                          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white hover:text-neutral-950"
                                          aria-label="Aumentar quantidade"
                                      >
                                          <Plus size={15} />
                                      </button>
                                  </div>
                              </div>

                      <div className="flex items-center gap-4">
                        <p className="text-lg font-black">
                          {formatPrice(
                            (item.product.price || 0) * item.quantity
                          )}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeItem(item.product.slug)}
                          className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-white/45">
              Resumo da encomenda
            </p>

            <div className="mt-6 flex items-center justify-between border-b border-white/10 pb-5">
              <span className="text-white/60">Subtotal</span>
              <span className="text-xl font-black">
                {formatPrice(total)}
              </span>
            </div>

            
                          <Link
                              href="/checkout"
                              className="mt-7 flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-neutral-950 transition hover:bg-stone-200"
                          >
                              Continuar para checkout
                          </Link>

            <p className="mt-4 text-center text-xs text-white/35">
              Stripe e checkout real entram na próxima fase.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}