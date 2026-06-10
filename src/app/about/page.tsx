import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

export default function AboutPage() {
  return (
    <main className="bg-[#070706] text-white">
      <section className="px-6 pb-20 pt-36 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
              Sobre a TERR4
            </p>

            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.92] tracking-[-0.04em] md:text-7xl">
              Outdoor gear para quem quer ir mais longe.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c8c4be]/60">
              Equipamento simples, robusto e bonito para transformar qualquer
              veículo numa base de aventura.
            </p>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <section className="bg-[#d8d0c2] px-6 py-20 text-[#2a2520] md:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#2a2520]/50">
                A nossa história
              </p>

              <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.04em] md:text-5xl">
                Nascemos da estrada.
              </h2>

              <p className="mt-6 text-base leading-8 text-[#2a2520]/70 md:text-lg">
                A TERR4 nasce da vontade de criar equipamento simples, robusto e
                bonito para viagens, campismo e aventura.
              </p>

              <p className="mt-5 text-base leading-8 text-[#2a2520]/70 md:text-lg">
                Cada produto é pensado para transformar o carro numa base
                confortável, resistente e pronta para qualquer saída.
              </p>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] bg-[#070706] shadow-[0_40px_80px_rgba(0,0,0,0.22)]">
              <Image
                src="/images/terr4/brand-install-2.jpg"
                alt="Logótipo TERR4 aplicado em equipamento outdoor"
                width={1200}
                height={900}
                className="aspect-[16/10] w-full object-cover object-center transition duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
              O que nos guia
            </p>

            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.04em] md:text-6xl">
              Simples. Robusto. Bonito.
            </h2>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Simplicidade",
                  text: "Montar rápido, usar sem complicações e seguir viagem.",
                },
                {
                  title: "Resistência",
                  text: "Materiais preparados para chuva, vento, sol e estrada.",
                },
                {
                  title: "Liberdade",
                  text: "O teu veículo torna-se a tua base, em qualquer lugar.",
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 transition-colors duration-300 hover:border-[#c46a2d]/30 hover:bg-white/[0.06]"
                >
                  <div className="mb-1 h-[2px] w-8 bg-[#c46a2d] transition-all duration-300 group-hover:w-16" />

                  <h3 className="mt-5 text-2xl font-black">{v.title}</h3>

                  <p className="mt-4 text-sm leading-7 text-[#c8c4be]/60">
                    {v.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}