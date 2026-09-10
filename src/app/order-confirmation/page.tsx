import Link from "next/link";
import { CheckCircle, ArrowUpRight, CircleAlert } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { ClearPaidCart } from "./clear-paid-cart";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ payment_intent?: string }>;
};

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const { payment_intent: paymentIntentId } = await searchParams;
  let isPaid = false;

  if (paymentIntentId?.startsWith("pi_")) {
    try {
      const [paymentIntent, order] = await Promise.all([
        stripe.paymentIntents.retrieve(paymentIntentId),
        prisma.order.findUnique({ where: { stripePaymentIntentId: paymentIntentId } }),
      ]);
      isPaid = Boolean(
        order &&
        paymentIntent.status === "succeeded" &&
        paymentIntent.metadata.orderId === order.id &&
        paymentIntent.amount_received === order.totalCents &&
        paymentIntent.currency === "eur"
      );
    } catch (error) {
      console.error("Erro ao validar confirmação da encomenda:", error);
    }
  }

  return (
    <main className="min-h-screen bg-[#070706] px-6 pb-28 pt-40 text-white">
      <section className="mx-auto max-w-2xl text-center">
        {isPaid && <ClearPaidCart />}
        <div className={`mx-auto flex size-24 items-center justify-center rounded-full border ${isPaid ? "border-[#2d4a2d]/50 bg-[#2d4a2d]/20 text-green-300" : "border-amber-300/30 bg-amber-400/10 text-amber-200"}`}>
          {isPaid ? <CheckCircle size={42} strokeWidth={1.5} /> : <CircleAlert size={42} strokeWidth={1.5} />}
        </div>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
          {isPaid ? "Pagamento recebido" : "Pagamento não confirmado"}
        </p>
        <h1 className="mt-4 text-6xl font-black leading-[0.9] tracking-[-0.04em] md:text-8xl">
          {isPaid ? "Encomenda confirmada." : "Confirmação indisponível."}
        </h1>
        <p className="mx-auto mt-7 max-w-md text-lg leading-8 text-[#c8c4be]/60">
          {isPaid
            ? "Obrigado pela tua compra. O pagamento foi processado com sucesso e a equipa TERR4 vai preparar a tua encomenda."
            : "Não encontrámos uma confirmação válida neste endereço. Verifica o estado do pagamento antes de tentares novamente ou fala connosco."}
        </p>
        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop" className="btn-wipe group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#f4efe4] px-8 text-sm font-black uppercase tracking-[0.1em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white">
            Ver produtos
            <ArrowUpRight size={15} />
          </Link>
          <Link href="/contact" className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-8 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:border-white/30 hover:bg-white/[0.08]">
            Falar connosco
          </Link>
        </div>
      </section>
    </main>
  );
}
