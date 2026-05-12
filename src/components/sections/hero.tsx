import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <Image
        src="/images/hero-jeep.jpeg"
        alt="TERR4 rooftop tent mounted on an overland vehicle"
        fill
        priority
        className="object-cover opacity-75"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-6 pb-24 pt-32">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-stone-200/80">
            Rooftop tents · Outdoor gear · Portugal
          </p>

          <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Built to sleep where the road ends.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            A TERR4 cria equipamento outdoor premium para transformar qualquer
            veículo numa base confortável, resistente e pronta para aventura.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/shop">Ver produtos</Button>
            <Button href="/contact" variant="secondary">
              Pedir informação
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}