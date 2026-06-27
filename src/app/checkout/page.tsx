"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion, type Variants } from "framer-motion";
import { createPaymentIntentAction } from "./actions";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import type { StoreProduct } from "@/lib/products";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

// Preço efetivo do produto: promoção se ativa, senão normal.
// Bate certo com o cálculo do servidor (checkout/actions.ts).
function effectivePrice(product: StoreProduct): number {
  if (product.onSale && product.salePrice) return product.salePrice;
  return product.price || 0;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creatingPayment, setCreatingPayment] = useState(false);

  const total = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + effectivePrice(item.product) * item.quantity,
      0
    );
  }, [items]);

  useEffect(() => {
    if (items.length === 0 && !clientSecret) router.push("/cart");
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
    <main className="min-h-[100dvh] bg-[#070706] px-6 pb-28 pt-40 text-white">
      <section className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
            Checkout
          </p>
          <h1 className="mt-4 text-6xl font-black leading-[0.9] tracking-[-0.04em] md:text-8xl">
            Finalizar encomenda.
          </h1>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            {!clientSecret ? (
              <form ref={formRef} onSubmit={handleCreatePayment} className="space-y-6">
                <input
                  type="hidden"
                  name="items"
                  value={JSON.stringify(
                    items.map((item) => ({ slug: item.product.slug, quantity: item.quantity }))
                  )}
                />

                <motion.div
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7"
                >
                  <h2 className="text-2xl font-black">Dados de contacto</h2>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <CheckoutInput name="firstName" placeholder="Nome" required />
                    <CheckoutInput name="lastName" placeholder="Apelido" />
                    <CheckoutInput name="email" placeholder="Email" type="email" required />
                    <CheckoutInput name="phone" placeholder="Telefone" />
                  </div>
                </motion.div>

                <motion.div
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7"
                >
                  <h2 className="text-2xl font-black">Morada de entrega</h2>
                  <div className="mt-6 grid gap-4">
                    <CheckoutInput name="address" placeholder="Morada" />
                    <div className="grid gap-4 md:grid-cols-3">
                      <CheckoutInput name="postalCode" placeholder="Código postal" />
                      <CheckoutInput name="city" placeholder="Cidade" />
                      <CheckoutInput name="country" placeholder="País" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7"
                >
                  <h2 className="text-2xl font-black">Notas</h2>
                  <textarea
                    name="notes"
                    rows={4}
                    placeholder="Informações adicionais sobre a encomenda..."
                    className="mt-6 w-full resize-none rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-white outline-none placeholder:text-white/30 transition-colors focus:border-[#c46a2d]/60 focus:bg-white/[0.07]"
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={creatingPayment}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-wipe flex h-14 w-full items-center justify-center rounded-full bg-[#f4efe4] px-6 text-sm font-black uppercase tracking-[0.1em] text-neutral-950 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingPayment ? "A preparar pagamento..." : "Continuar para pagamento"}
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[2rem] border border-white/10 bg-white p-7 text-neutral-950"
              >
                <h2 className="text-2xl font-black">Pagamento</h2>
                <div className="mt-6">
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "flat" } }}>
                    <PaymentForm clearCart={clearCart} />
                  </Elements>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-fit rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-7 lg:sticky lg:top-28"
          >
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a79d8d]">
              Resumo
            </p>

            <div className="mt-6 space-y-4">
              {items.map((item) => {
                const unit = effectivePrice(item.product);
                const onSale = item.product.onSale && item.product.salePrice;
                return (
                  <div key={item.product.slug} className="flex gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-3">
                    <div className="overflow-hidden rounded-2xl">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={80}
                        height={64}
                        className="aspect-[4/3] object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-white">{item.product.name}</p>
                        {onSale && (
                          <span className="rounded-full bg-[#c46a2d] px-2 py-0.5 text-[10px] font-black text-white">
                            -{item.product.discountPercent}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/45">×{item.quantity}</span>
                        <span className="text-sm font-black">
                          {formatPrice(unit * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-[#c8c4be]/55">Total</span>
                <span className="text-3xl font-black text-white">{formatPrice(total)}</span>
              </div>
              <p className="mt-4 text-center text-xs text-[#c8c4be]/30">
                Pagamento seguro integrado por Stripe
              </p>
            </div>
          </motion.aside>
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
      confirmParams: { return_url: `${appUrl}/order-confirmation` },
    });
    if (result.error) { setPaying(false); return; }
    clearCart();
  }

  return (
    <form onSubmit={handlePayment}>
      <PaymentElement />
      <motion.button
        type="submit"
        disabled={!stripe || paying}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        className="btn-wipe mt-7 flex h-13 w-full items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {paying ? "A processar..." : "Pagar agora"}
      </motion.button>
    </form>
  );
}

function CheckoutInput({
  name, placeholder, type = "text", required,
}: {
  name: string; placeholder: string; type?: string; required?: boolean;
}) {
  return (
    <input
      name={name}
      required={required}
      type={type}
      placeholder={placeholder}
      className="h-13 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-white outline-none placeholder:text-white/30 transition-colors focus:border-[#c46a2d]/60 focus:bg-white/[0.07]"
    />
  );
}