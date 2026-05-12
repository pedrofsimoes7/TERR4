const faqs = [
  {
    q: "A TERR4 Start é compatível com o meu carro?",
    a: "É compatível com a maioria dos veículos com barras de tejadilho transversais adequadas. Deve confirmar a capacidade dinâmica do tejadilho e as recomendações do fabricante.",
  },
  {
    q: "Quanto tempo demora a montagem?",
    a: "A montagem da tenda demora cerca de 60 segundos, depois de instalada nas barras do veículo.",
  },
  {
    q: "A tenda aguenta chuva?",
    a: "Sim. A TERR4 Start usa rainfly Oxford 420D e corpo Canvas Rip-Stop 280g, ambos com impermeabilidade 2500mm.",
  },
  {
    q: "Tem garantia?",
    a: "Sim. A TERR4 Start tem 3 anos de garantia contra defeitos de fabrico.",
  },
];

export default function FaqPage() {
  return (
    <main className="bg-neutral-950 px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          FAQ
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
          Perguntas frequentes.
        </h1>

        <div className="mt-12 divide-y divide-white/10 rounded-[2rem] border border-white/10 bg-white/[0.04]">
          {faqs.map((faq) => (
            <div key={faq.q} className="p-7">
              <h2 className="text-xl font-black">{faq.q}</h2>
              <p className="mt-3 leading-7 text-white/60">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}