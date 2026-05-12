import { ProductCard } from "@/components/ui/product-card";
import { getProducts } from "@/lib/products";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="bg-neutral-950 px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          Loja
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
          Equipamento TERR4
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
          Rooftop tents e outdoor gear para transformar qualquer saída numa
          experiência mais confortável, simples e livre.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}