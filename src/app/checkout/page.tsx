"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createOrderAction } from "./actions";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const router = useRouter();

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + (item.product.price || 0) * item.quantity;
    }, 0);
  }, [items]);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  if (items.length === 0) return null;

  return (
    <main className="bg-neutral-950 px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Checkout
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Finalizar encomenda.
            </h1>

            <form
              action={async (formData) => {
                await createOrderAction(formData);
                clearCart();
              }}
              className="mt-10 space-y-8"
            >
              <input
                type="hidden"
                name="items"
                value={JSON.stringify(
                  items.map((item) => ({
                    slug: item.product.slug,
                    quantity: item.quantity,
                  }))
                )}
              />

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
                <h2 className="text-2xl font-black">
                  Dados de contacto
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Input
                    name="firstName"
                    placeholder="Nome"
                    required
                  />

                  <Input
                    name="lastName"
                    placeholder="Apelido"
                  />

                  <Input
                    name="email"
                    placeholder="Email"
                    type="email"
                    required
                  />

                  <Input
                    name="phone"
                    placeholder="Telefone"
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
                <h2 className="text-2xl font-black">
                  Morada de entrega
                </h2>

                <div className="mt-6 grid gap-5">
                  <Input
                    name="address"
                    placeholder="Morada"
                  />

                  <div className="grid gap-5 md:grid-cols-3">
                    <Input
                      name="postalCode"
                      placeholder="Código postal"
                    />

                    <Input
                      name="city"
                      placeholder="Cidade"
                    />

                    <Input
                      name="country"
                      placeholder="País"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
                <h2 className="text-2xl font-black">
                  Informações adicionais
                </h2>

                <textarea
                  name="notes"
                  rows={5}
                  placeholder="Notas sobre a encomenda..."
                  className="mt-6 w-full rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-white outline-none placeholder:text-white/35"
                />
              </div>

              <button
                type="submit"
                className="flex h-13 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950 transition hover:bg-stone-200"
              >
                Finalizar pedido
              </button>
            </form>
          </div>

          <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 lg:sticky lg:top-28">
            <h2 className="text-2xl font-black">
              Resumo da encomenda
            </h2>

            <div className="mt-7 space-y-5">
              {items.map((item) => (
                <div
                  key={item.product.slug}
                  className="flex gap-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4"
                >
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={120}
                      height={100}
                      className="aspect-[4/3] object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm text-white/45">
                        {item.product.category}
                      </p>

                      <h3 className="mt-1 font-black">
                        {item.product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/55">
                        x{item.quantity}
                      </span>

                      <span className="font-bold">
                        {formatPrice(
                          (item.product.price || 0) * item.quantity
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-white/55">Subtotal</span>

                <span className="text-2xl font-black">
                  {formatPrice(total)}
                </span>
              </div>

              <p className="mt-4 text-center text-xs text-white/35">
                Pedido real guardado na base de dados.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Input({
  name,
  placeholder,
  type = "text",
  required,
}: {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      required={required}
      type={type}
      placeholder={placeholder}
      className="h-13 w-full rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/35"
    />
  );
}