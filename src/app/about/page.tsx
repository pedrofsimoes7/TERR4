import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

export default function AboutPage() {
  return (
    <main className="bg-[#070706] text-white">

      {/* Hero section */}
      <section className="px-6 pb-24 pt-40">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
              Sobre a TERR4
            </p>
            <h1 className="mt-4 max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.04em] md:text-8xl">
              Outdoor gear para quem quer ir mais longe.
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Split content */}
      <Reveal>
        <section className="bg-[#d8d0c2] px-6 py-24 text-[#2a2520]">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#2a2520]/50">
                A nossa história
              </p>
              <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.04em] md:text-6xl">
                Nascemos da estrada.
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#2a2520]/70">
                A TERR4 nasce da vontade de criar equipamento simples, robusto e
                bonito para viagens, campismo e aventura. Produtos pensados para
                transformar o carro numa base confortável, esteja onde estiveres.
              </p>
              <p className="mt-5 text-lg leading-8 text-[#2a2520]/70">
                Cada produto é desenhado com um princípio: deve ser fácil de
                montar, resistente ao que a natureza oferece, e suficientemente
                bonito para orgulhares-te de ter no teu veículo.
              </p>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)]">
              <Image
                src="/images/founder.jpg"
                alt="TERR4 team"
                width={900}
                height={1200}
                className="aspect-[4/5] object-cover transition duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>
        </section>
      </Reveal>

      {/* Values strip */}
      <Reveal>
        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
              O que nos guia
            </p>
            <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.04em] md:text-6xl">
              Simples. Robusto. Bonito.
            </h2>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Simplicidade",
                  text: "Montar em 60 segundos não é acidente, é obsessão de design. Cada mecanismo é testado até ser óbvio.",
                },
                {
                  title: "Resistência",
                  text: "Materiais técnicos escolhidos para aguentar chuva, vento e UV. Garantia de 3 anos porque acreditamos no produto.",
                },
                {
                  title: "Liberdade",
                  text: "Não precisas de campismo organizado. Com a TERR4, o teu veículo é a tua base, em qualquer sítio.",
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="mb-1 h-px w-8 bg-[#c46a2d] transition-all duration-300 group-hover:w-16" />
                  <h3 className="mt-5 text-2xl font-black">{v.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#c8c4be]/60">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

    </main>
  );
}