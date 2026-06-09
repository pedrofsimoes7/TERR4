"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-6 px-7 py-6 text-left transition-colors duration-200 hover:bg-white/[0.02]"
      >
        <span className="text-lg font-black text-white">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#a79d8d] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
        style={{ transitionProperty: "max-height, opacity" }}
      >
        <p className="px-7 pb-7 text-base leading-7 text-[#c8c4be]/65">{a}</p>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#070706] px-6 pb-28 pt-40 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
          FAQ
        </p>
        <h1 className="mt-4 text-6xl font-black leading-[0.9] tracking-[-0.04em] md:text-8xl">
          Perguntas frequentes.
        </h1>
        <p className="mt-6 text-lg leading-8 text-[#c8c4be]/60">
          Tudo o que precisas de saber antes de partir.
        </p>

        <div className="mt-14 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>
    </main>
  );
}