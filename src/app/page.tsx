import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Shield, Timer, Weight } from "lucide-react";
import { featuredProduct, products } from "@/data/products";
import { Hero } from "@/components/sections/hero";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { Reveal } from "@/components/motion/reveal";

export default function Home() {
  return (
    <main>
      <Hero />

      <Reveal>
        <section className="bg-neutral-950 px-6 py-24 text-white">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
                Produto em destaque
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
                {featuredProduct.name}
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/65">
                {featuredProduct.shortDescription}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Stat icon={<Timer size={18} />} label="Montagem" value="60 seg." />
                <Stat icon={<Weight size={18} />} label="Peso" value="56 kg" />
                <Stat icon={<Shield size={18} />} label="Garantia" value="3 anos" />
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/shop/terr4-start">Ver detalhes</Button>
                <Button href="/contact" variant="secondary">
                  Quero reservar
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <Image
                src="/images/warehouse-2.jpg"
                alt="TERR4 Start mounted on vehicle"
                width={1200}
                height={900}
                className="aspect-[4/3] object-cover"
              />
              <div className="absolute left-5 top-5 rounded-full bg-black/60 px-4 py-2 text-sm font-semibold backdrop-blur">
                €{featuredProduct.price}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-[#ebe5d8] px-6 py-24 text-neutral-950">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative overflow-hidden rounded-[2rem]">
              <Image
                src="/images/mug.jpeg"
                alt="TERR4 lifestyle outdoor mug"
                width={1000}
                height={1300}
                className="aspect-[4/5] object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-neutral-500">
                Built for every forecast
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                Conforto de casa, mesmo longe dela.
              </h2>
              <p className="mt-5 text-lg leading-8 text-neutral-700">
                Shell em ABS, tecidos impermeáveis, resistência UV e colchão de
                alta densidade. A TERR4 Start foi desenhada para montar rápido,
                dormir bem e aguentar condições exigentes.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Impermeabilidade 2500mm",
                  "Canvas Rip-Stop 280g",
                  "Montagem simples em 60 segundos",
                  "Compatível com a maioria dos veículos",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex size-6 items-center justify-center rounded-full bg-neutral-950 text-white">
                      <Check size={14} />
                    </span>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-neutral-950 px-6 py-24 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
                  Produtos
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                  Equipamento TERR4
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"
              >
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-stone-300">{icon}</div>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}