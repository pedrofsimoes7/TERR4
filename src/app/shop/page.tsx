import { ProductCard } from "@/components/ui/product-card";
import { getProducts } from "@/lib/products";
import { Reveal } from "@/components/motion/reveal";

function AnimatedHeadline({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <h1 className="mt-5 max-w-[14ch] text-5xl font-black leading-[0.9] tracking-[-0.055em] text-white md:text-7xl">
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="word-animate mr-[0.18em] inline-block last:mr-0"
          style={{ animationDelay: `${0.1 + i * 0.06}s` }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#070706] px-6 pb-28 pt-40 text-[#c8c4be]">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
              Loja
            </p>

            <AnimatedHeadline text="Equipamento para estrada, campismo e liberdade." />
          </div>

          <p className="max-w-md text-base leading-7 text-[#c8c4be]/60 lg:pb-2">
            Rooftop tents e outdoor gear premium para transformar qualquer saída
            numa experiência mais confortável, simples e livre.
          </p>
        </div>

        <Reveal>
          <div className="mt-14 grid gap-7 md:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Reveal>
      </section>
    </main>
  );
}