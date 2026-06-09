import Link from "next/link";
import { CheckCircle, ArrowUpRight } from "lucide-react";

type PageProps = {
  searchParams: Promise<{
    payment_intent?: string;
    redirect_status?: string;
  }>;
};

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const isPaid = params.redirect_status === "succeeded";

  return (
    <main className="min-h-screen bg-[#070706] px-6 pb-28 pt-40 text-white">
      <section className="mx-auto max-w-2xl text-center">

        <div className="mx-auto flex size-24 items-center justify-center rounded-full border border-[#2d4a2d]/50 bg-[#2d4a2d]/20 text-green-300">
          <CheckCircle size={42} strokeWidth={1.5} />
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
          {isPaid ? "Pagamento recebido" : "Pedido recebido"}
        </p>

        <h1 className="mt-4 text-6xl font-black leading-[0.9] tracking-[-0.04em] md:text-8xl">
          {isPaid ? "Encomenda confirmada." : "Encomenda registada."}
        </h1>

        <p className="mx-auto mt-7 max-w-md text-lg leading-8 text-[#c8c4be]/60">
          {isPaid
            ? "Obrigado pela tua compra. O pagamento foi processado com sucesso e a equipa TERR4 vai preparar a tua encomenda."
            : "Recebemos o teu pedido. A encomenda será atualizada automaticamente quando o pagamento for validado."}
        </p>

        {params.payment_intent && (
          <p className="mx-auto mt-6 max-w-sm rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 font-mono text-xs text-white/35">
            {params.payment_intent.slice(0, 22)}...
          </p>
        )}

        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="btn-wipe group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#f4efe4] px-8 text-sm font-black uppercase tracking-[0.1em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white"
          >
            Ver produtos
            <ArrowUpRight size={15} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-8 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08]"
          >
            Falar connosco
          </Link>
        </div>
      </section>
    </main>
  );
}