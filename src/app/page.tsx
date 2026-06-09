import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Shield, Timer, Weight } from "lucide-react";
import { getProducts } from "@/lib/products";
import { Hero } from "@/components/sections/hero";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/reveal";

export default async function Home() {
  const products = await getProducts();
  const featured = products.find((p) => p.slug === "terr4-start") ?? products[0];

  return (
    <main className="bg-[#070706]">
      <Hero />

      {/* ── Ticker ── */}
      <div className="ticker-skew overflow-hidden border-y border-white/8 bg-white">
        <div className="flex whitespace-nowrap py-4 text-[2.2rem] font-black uppercase tracking-[-0.03em] text-neutral-950 md:text-5xl">
          <span className="animate-[marquee_16s_linear_infinite] flex shrink-0 items-center">
            Rooftop Tents&nbsp;&nbsp;<span className="text-[#c46a2d]">✦</span>&nbsp;&nbsp;Outdoor Gear&nbsp;&nbsp;<span className="text-[#c46a2d]">✦</span>&nbsp;&nbsp;Built for the Road&nbsp;&nbsp;<span className="text-[#c46a2d]">✦</span>&nbsp;&nbsp;Portugal&nbsp;&nbsp;<span className="text-[#c46a2d]">✦</span>&nbsp;&nbsp;
            Rooftop Tents&nbsp;&nbsp;<span className="text-[#c46a2d]">✦</span>&nbsp;&nbsp;Outdoor Gear&nbsp;&nbsp;<span className="text-[#c46a2d]">✦</span>&nbsp;&nbsp;Built for the Road&nbsp;&nbsp;<span className="text-[#c46a2d]">✦</span>&nbsp;&nbsp;Portugal&nbsp;&nbsp;<span className="text-[#c46a2d]">✦</span>&nbsp;&nbsp;
          </span>
        </div>
      </div>

      {/* ── Featured product ── */}
      <Reveal>
        <section className="px-6 py-24 text-white">
          <div className="mx-auto max-w-7xl">

            {/* Header row */}
            <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#a79d8d]">
                  Produto em destaque
                </p>
                <h2 className="mt-3 text-5xl font-black leading-[0.9] tracking-[-0.04em] md:text-7xl">
                  {featured.name}
                </h2>
                <p className="mt-4 max-w-lg text-base leading-7 text-[#c8c4be]/60">
                  {featured.shortDescription}
                </p>
              </div>

              {/* Stats */}
              <StaggerReveal className="grid grid-cols-3 gap-3 md:w-auto">
                <StaggerItem><StatCard icon={<Timer size={16} />} label="Montagem" value="60s" /></StaggerItem>
                <StaggerItem><StatCard icon={<Weight size={16} />} label="Peso" value="56kg" /></StaggerItem>
                <StaggerItem><StatCard icon={<Shield size={16} />} label="Garantia" value="3 anos" /></StaggerItem>
              </StaggerReveal>
            </div>

            {/* Split card */}
            <div className="overflow-hidden rounded-[2.5rem] border border-white/8 bg-[#0e0c0a]">
              <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
                <div className="relative min-h-[380px] overflow-hidden lg:min-h-[500px]">
                  <Image src="/images/terr4/brand-rooftop.jpg" alt="TERR4 Start" fill
                    className="object-cover transition duration-700 hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0e0c0a]/70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a]/60 to-transparent" />
                </div>

                <div className="flex flex-col justify-between p-8 md:p-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#a79d8d]">
                      Basecamp System
                    </p>
                    <h3 className="mt-4 text-3xl font-black leading-[1.1] tracking-[-0.03em] text-white md:text-4xl">
                      Monta rápido.<br />Dorme melhor.<br />Vai mais longe.
                    </h3>
                    <p className="mt-5 text-sm leading-7 text-[#c8c4be]/58">
                      Uma solução simples e robusta para transformar o teu veículo numa base de exploração confortável.
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <Button href="/shop/terr4-start">Ver produto</Button>
                    <Button href="/contact" variant="secondary">Quero reservar</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Beige editorial section ── */}
      <Reveal>
        <section className="bg-[#d8d0c2] px-6 py-24 text-[#1a1714]">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-[2.5rem] shadow-[0_48px_96px_rgba(0,0,0,0.22)]">
                <Image src="/images/mug.jpeg" alt="TERR4 outdoor" width={900} height={1100}
                  className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-[1.02]" />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#1a1714]/45">
                Built for every forecast
              </p>
              <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.04em] md:text-6xl">
                Conforto de casa,<br />mesmo longe dela.
              </h2>
              <p className="mt-6 text-base leading-7 text-[#1a1714]/65">
                Shell em ABS, tecidos impermeáveis, resistência UV e colchão de alta densidade. Desenhada para montar rápido, dormir bem e aguentar condições exigentes.
              </p>

              <StaggerReveal className="mt-8 grid gap-2.5 sm:grid-cols-2" initialDelay={0.1}>
                {["Impermeabilidade 2500mm", "Canvas Rip-Stop 280g", "Montagem em 60 segundos", "Compatível com a maioria dos veículos"].map((item) => (
                  <StaggerItem key={item}>
                    <div className="flex items-center gap-3 rounded-full border border-[#1a1714]/12 bg-white/35 px-4 py-3 transition-colors duration-200 hover:bg-white/55">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1a1714]">
                        <Check size={11} className="text-white" />
                      </span>
                      <span className="text-xs font-bold">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerReveal>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Numbers strip ── */}
      <Reveal>
        <section className="border-y border-white/8 bg-[#0a0908] px-6 py-0 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid divide-x divide-white/8 sm:grid-cols-3">
              <NumberCell number="60" unit="seg." label="Montagem" sub="do fecho à cama" />
              <NumberCell number="2500" unit="mm" label="Impermeabilidade" sub="para qualquer chuva" />
              <NumberCell number="3" unit="anos" label="Garantia" sub="contra defeitos de fabrico" />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Product grid ── */}
      <Reveal>
        <section className="px-6 py-24 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#a79d8d]">
                  Produtos
                </p>
                <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.04em] md:text-6xl">
                  Equipamento TERR4
                </h2>
              </div>
              <Link href="/shop"
                className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-white">
                Ver todos
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <StaggerReveal className="grid gap-5 md:grid-cols-2" staggerDelay={0.1}>
              {products.map((product) => (
                <StaggerItem key={product.slug}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </section>
      </Reveal>

      {/* ── Final CTA ── */}
      <Reveal>
        <section className="px-6 pb-24 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-[2.5rem] bg-[#d8d0c2] px-8 py-16 text-[#1a1714] md:px-16">
              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#1a1714]/45">
                    Pronto para partir?
                  </p>
                  <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.04em] md:text-5xl">
                    Transforma o teu veículo<br />numa base de aventura.
                  </h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/shop"
                    className="btn-wipe group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1a1714] px-7 text-xs font-black uppercase tracking-[0.12em] text-white transition duration-300 hover:-translate-y-0.5">
                    Ver produtos
                    <ArrowRight size={13} className="transition group-hover:translate-x-1" />
                  </Link>
                  <Link href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-[#1a1714]/20 px-7 text-xs font-black uppercase tracking-[0.12em] text-[#1a1714] transition duration-300 hover:bg-[#1a1714]/8">
                    Falar connosco
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="stat-shimmer rounded-2xl border border-white/8 bg-white/[0.04] p-4 transition-all duration-300 hover:border-[#c46a2d]/25 hover:bg-white/[0.07]">
      <div className="text-[#a79d8d]">{icon}</div>
      <p className="mt-3 text-[9px] font-black uppercase tracking-[0.22em] text-white/30">{label}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function NumberCell({
  number,
  unit,
  label,
  sub,
}: {
  number: string;
  unit: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="group px-8 py-16 text-center transition-colors duration-300 hover:bg-white/[0.03] md:px-12">
      <div className="text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-none tracking-[-0.04em] text-white">
        {number}
      </div>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.28em] text-white/90">
        {unit.replace(".", "")}
      </p>

      <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-white/70">
        {label}
      </p>

      <p className="mt-1 text-xs text-white/30">{sub}</p>
    </div>
  );
}