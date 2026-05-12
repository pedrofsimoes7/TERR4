import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  return {
    title: product ? `${product.name} | TERR4` : "Produto | TERR4",
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  return (
    <main className="bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 hover:text-white"
        >
          <ArrowLeft size={16} />
          Voltar à loja
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-5">
            {product.images.map((image) => (
              <div
                key={image}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]"
              >
                <Image
                  src={image}
                  alt={product.name}
                  width={1200}
                  height={900}
                  className="aspect-[4/3] object-cover"
                  priority={image === product.images[0]}
                />
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              {product.category}
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
              {product.name}
            </h1>

            <p className="mt-5 text-lg leading-8 text-white/65">
              {product.description}
            </p>

            <div className="mt-7 flex items-center gap-4">
              <p className="text-3xl font-black">
                {product.price ? `€${product.price}` : "Preço em breve"}
              </p>
              {product.stock !== undefined && (
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/70">
                  Stock: {product.stock}
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton product={product} />
              <Button href="/contact" variant="secondary">
                Reservar
              </Button>
            </div>

            <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-black">Especificações técnicas</h2>
              <div className="mt-5 divide-y divide-white/10">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between gap-6 py-3 text-sm"
                  >
                    <span className="text-white/45">{spec.label}</span>
                    <span className="text-right font-semibold text-white/85">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-black">Incluído</h2>
              <div className="mt-5 grid gap-3">
                {product.included.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm">
                    <span className="flex size-6 items-center justify-center rounded-full bg-white text-neutral-950">
                      <Check size={14} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {product.compatibility && (
              <InfoBlock title="Compatibilidade" text={product.compatibility} />
            )}

            {product.warranty && (
              <InfoBlock title="Garantia" text={product.warranty} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-white/60">{text}</p>
    </div>
  );
}