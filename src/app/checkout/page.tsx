"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntentAction } from "./actions";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creatingPayment, setCreatingPayment] = useState(false);

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + (item.product.price || 0) * item.quantity;
    }, 0);
  }, [items]);

  useEffect(() => {
    if (items.length === 0 && !clientSecret) {
      router.push("/cart");
    }
  }, [items, clientSecret, router]);

  async function handleCreatePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formRef.current) return;

    setCreatingPayment(true);

    const formData = new FormData(formRef.current);
    const result = await createPaymentIntentAction(formData);

    setClientSecret(result.clientSecret);
    setCreatingPayment(false);
  }

  if (items.length === 0 && !clientSecret) return null;

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

            {!clientSecret ? (
              <form
                ref={formRef}
                onSubmit={handleCreatePayment}
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
                  <h2 className="text-2xl font-black">Dados de contacto</h2>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <Input name="firstName" placeholder="Nome" required />
                    <Input name="lastName" placeholder="Apelido" />
                    <Input name="email" placeholder="Email" type="email" required />
                    <Input name="phone" placeholder="Telefone" />
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
                  <h2 className="text-2xl font-black">Morada de entrega</h2>

                  <div className="mt-6 grid gap-5">
                    <Input name="address" placeholder="Morada" />

                    <div className="grid gap-5 md:grid-cols-3">
                      <Input name="postalCode" placeholder="Código postal" />
                      <Input name="city" placeholder="Cidade" />
                      <Input name="country" placeholder="País" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
                  <h2 className="text-2xl font-black">Informações adicionais</h2>

                  <textarea
                    name="notes"
                    rows={5}
                    placeholder="Notas sobre a encomenda..."
                    className="mt-6 w-full rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-white outline-none placeholder:text-white/35"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingPayment}
                  className="flex h-13 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingPayment ? "A preparar pagamento..." : "Continuar para pagamento"}
                </button>
              </form>
            ) : (
              <div className="mt-10 rounded-[2rem] border border-white/10 bg-white p-7 text-neutral-950">
                <h2 className="text-2xl font-black">Pagamento</h2>

                <div className="mt-6">
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "flat",
                      },
                    }}
                  >
                    <PaymentForm clearCart={clearCart} />
                  </Elements>
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 lg:sticky lg:top-28">
            <h2 className="text-2xl font-black">Resumo da encomenda</h2>

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

                      <h3 className="mt-1 font-black">{item.product.name}</h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/55">
                        x{item.quantity}
                      </span>

                      <span className="font-bold">
                        {formatPrice((item.product.price || 0) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-white/55">Subtotal</span>

                <span className="text-2xl font-black">{formatPrice(total)}</span>
              </div>

              <p className="mt-4 text-center text-xs text-white/35">
                Pagamento seguro integrado por Stripe.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function PaymentForm({ clearCart }: { clearCart: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  async function handlePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) return;

    setPaying(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${appUrl}/order-confirmation`,
      },
    });

    if (result.error) {
      setPaying(false);
      return;
    }

    clearCart();
  }

  return (
    <form onSubmit={handlePayment}>
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || paying}
        className="mt-7 flex h-13 w-full items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-black text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {paying ? "A processar..." : "Pagar agora"}
      </button>
    </form>
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