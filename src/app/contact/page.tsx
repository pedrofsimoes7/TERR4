export default function ContactPage() {
  return (
    <main className="bg-neutral-950 px-6 pb-24 pt-36 text-white">
      <section className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
            Contacto
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
            Fala connosco.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
            Tens dúvidas sobre compatibilidade, stock, instalação ou encomendas?
            Envia-nos uma mensagem e ajudamos-te.
          </p>
        </div>

        <form className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="grid gap-5">
            <input
              placeholder="Nome"
              className="h-12 rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/35"
            />
            <input
              placeholder="Email"
              type="email"
              className="h-12 rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/35"
            />
            <input
              placeholder="Veículo"
              className="h-12 rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/35"
            />
            <textarea
              placeholder="Mensagem"
              rows={6}
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-white outline-none placeholder:text-white/35"
            />
            <button
              type="button"
              className="h-12 rounded-full bg-white px-6 font-bold text-neutral-950 transition hover:bg-stone-200"
            >
              Enviar mensagem
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}