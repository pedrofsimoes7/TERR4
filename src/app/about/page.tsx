import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-[#ebe5d8] px-6 pb-24 pt-36 text-neutral-950">
      <section className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-neutral-500">
            Sobre a TERR4
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
            Outdoor gear para quem quer ir mais longe.
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-700">
            A TERR4 nasce da vontade de criar equipamento simples, robusto e
            bonito para viagens, campismo e aventura. Produtos pensados para
            transformar o carro numa base confortável, esteja onde estiveres.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem]">
          <Image
            src="/images/founder.jpg"
            alt="TERR4 team"
            width={900}
            height={1200}
            className="aspect-[4/5] object-cover"
          />
        </div>
      </section>
    </main>
  );
}