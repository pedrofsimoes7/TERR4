import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/fade-up";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <Image
        src="/images/hero-jeep.jpeg"
        alt="TERR4 rooftop tent mounted on an overland vehicle"
        fill
        priority
        className="scale-105 object-cover opacity-80"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.14),transparent_28%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-6 pb-24 pt-32">
        <div className="max-w-4xl">
          <FadeUp>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-stone-200/80">
              Rooftop tents · Outdoor gear · Portugal
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.9] tracking-tight md:text-8xl">
              Built to sleep where the road ends.
            </h1>
          </FadeUp>

          <FadeUp delay={0.16}>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72 md:text-xl">
              A TERR4 cria equipamento outdoor premium para transformar qualquer
              veículo numa base confortável, resistente e pronta para aventura.
            </p>
          </FadeUp>

          <FadeUp delay={0.24}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/shop">Ver produtos</Button>
              <Button href="/contact" variant="secondary">
                Pedir informação
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/45 md:flex">
        <span>Scroll</span>
        <span className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5">
          <ArrowDown size={15} />
        </span>
      </div>
    </section>
  );
}