import Link from "next/link";

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Admin
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Encomendas
            </h1>
          </div>

          <Link
            href="/admin"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold text-white/70 hover:bg-white hover:text-neutral-950"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">
          <h2 className="text-2xl font-black">
            Sem encomendas ainda
          </h2>

          <p className="mt-4 text-white/45">
            Quando o checkout real estiver ligado ao Stripe, as encomendas vão aparecer aqui.
          </p>
        </div>
      </section>
    </main>
  );
}