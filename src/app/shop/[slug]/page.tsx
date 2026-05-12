import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Package, Ruler, Shield, Truck } from "lucide-react";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { formatPrice } from "@/lib/utils";

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
    <main className="bg-neutral-950 text-white">
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar à loja
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.04]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={1400}
                  height={1000}
                  className="aspect-[4/3] object-cover"
                  priority
                />
                <div className="absolute left-5 top-5 rounded-full bg-black/65 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
                  {product.status === "available" ? "Disponível" : "Brevemente"}
                </div>
              </div>

              {product.images.slice(1).length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {product.images.slice(1).map((image) => (
                    <div
                      key={image}
                      className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04]"
                    >
                      <Image
                        src={image}
                        alt={product.name}
                        width={900}
                        height={700}
                        className="aspect-[4/3] object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
                  {product.category}
                </p>

                <h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
                  {product.name}
                </h1>

                <p className="mt-5 text-lg leading-8 text-white/65">
                  {product.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <p className="text-3xl font-black">
                    {product.price ? formatPrice(product.price) : "Preço em breve"}
                  </p>

                  {product.stock !== undefined && (
                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/70">
                      Stock: {product.stock}
                    </span>
                  )}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <AddToCartButton product={product} />
                  <Button href="/contact" variant="secondary">
                    Reservar
                  </Button>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <MiniTrust icon={<Truck size={16} />} label="Envio" value="A combinar" />
                  <MiniTrust icon={<Shield size={16} />} label="Garantia" value="3 anos" />
                  <MiniTrust icon={<Package size={16} />} label="Inclui" value="Kit completo" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <Feature
            icon={<Ruler size={22} />}
            title="Compacta em viagem"
            text="Fecha em apenas 28 cm de altura para manter o perfil baixo do veículo."
          />
          <Feature
            icon={<Shield size={22} />}
            title="Preparada para clima exigente"
            text="Materiais impermeáveis, resistentes a UV e pensados para uso outdoor."
          />
          <Feature
            icon={<Package size={22} />}
            title="Montagem rápida"
            text="Sistema simples para abrir a tenda em cerca de 60 segundos."
          />
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Detalhes técnicos
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Feita para aguentar, simples de usar.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/60">
              A construção combina estrutura leve, tecidos técnicos e conforto
              real para dormires melhor fora de casa.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-2xl border border-white/10 bg-neutral-950/45 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    {spec.label}
                  </p>
                  <p className="mt-2 font-bold text-white/90">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ebe5d8] px-6 py-24 text-neutral-950">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <InfoPanel title="Incluído">
            <div className="space-y-3">
              {product.included.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <span className="flex size-6 items-center justify-center rounded-full bg-neutral-950 text-white">
                    <Check size={14} />
                  </span>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </InfoPanel>

          {product.compatibility && (
            <InfoPanel title="Compatibilidade">
              <p className="text-sm leading-7 text-neutral-700">
                {product.compatibility}
              </p>
            </InfoPanel>
          )}

          {product.warranty && (
            <InfoPanel title="Garantia">
              <p className="text-sm leading-7 text-neutral-700">
                {product.warranty}
              </p>
            </InfoPanel>
          )}
        </div>
      </section>
    </main>
  );
}

function MiniTrust({
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
      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-neutral-950/50 p-6">
      <div className="text-stone-300">{icon}</div>
      <h3 className="mt-5 text-xl font-black">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
    </div>
  );
}

function InfoPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] bg-white/60 p-7 shadow-sm ring-1 ring-black/5">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}