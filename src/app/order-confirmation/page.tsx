import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmationPage() {
  return (
    <main className="bg-neutral-950 px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-white text-neutral-950">
          <CheckCircle size={36} />
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          Pedido recebido
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
          Encomenda registada.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/60">
          Esta é uma confirmação temporária. Na próxima fase, esta página será
          ligada ao pagamento Stripe e ao sistema real de encomendas.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-neutral-950 transition hover:bg-stone-200"
          >
            Ver produtos
          </Link>

          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white hover:text-neutral-950"
          >
            Voltar ao início
          </Link>
        </div>
      </section>
    </main>
  );
}