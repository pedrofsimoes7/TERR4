import Link from "next/link";
import { CheckCircle } from "lucide-react";

type PageProps = {
  searchParams: Promise<{
    payment_intent?: string;
    redirect_status?: string;
  }>;
};

export default async function OrderConfirmationPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const isPaid = params.redirect_status === "succeeded";

  return (
    <main className="bg-neutral-950 px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-white text-neutral-950">
          <CheckCircle size={36} />
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          {isPaid ? "Pagamento recebido" : "Pedido recebido"}
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
          {isPaid ? "Encomenda confirmada." : "Encomenda registada."}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/60">
          {isPaid
            ? "Obrigado pela tua compra. O pagamento foi processado com sucesso e a equipa TERR4 vai preparar a tua encomenda."
            : "Recebemos o teu pedido. Se o pagamento ainda estiver a ser confirmado, a encomenda será atualizada automaticamente quando a Stripe validar o pagamento."}
        </p>

        {params.payment_intent && (
          <p className="mx-auto mt-5 max-w-xl rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs text-white/40">
            Referência Stripe: {params.payment_intent.slice(0, 18)}...
          </p>
        )}

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-neutral-950 transition hover:bg-stone-200"
          >
            Ver produtos
          </Link>

          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white hover:text-neutral-950"
          >
            Falar connosco
          </Link>
        </div>
      </section>
    </main>
  );
}