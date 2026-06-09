import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Package, Ruler, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/reveal";
import { formatPrice } from "@/lib/utils";
import { getProductBySlug, getProducts } from "@/lib/products";
import { ProductGallery } from "@/components/ui/product-gallery";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const trustIcons = [Truck, Shield, Package];
const featureIcons = [Ruler, Shield, Package];

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product ? `${product.name} | TERR4` : "Produto | TERR4",
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const trustItems =
    product.trustItems.length > 0
      ? product.trustItems
      : [
          { label: "Envio", value: "A combinar" },
          { label: "Garantia", value: "12 meses" },
          { label: "Inclui", value: "Produto TERR4" },
        ];

  return (
    <main className="bg-[#070706] pb-24 text-[#c8c4be] md:pb-0">
      <section className="px-6 pb-20 pt-36">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#c8c4be]/45 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              Voltar à loja
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
            <Reveal delay={0.05}>

              <ProductGallery

                images={product.images}

                alt={product.name}

              />

            </Reveal>

            <Reveal delay={0.15}>
              <aside className="lg:sticky lg:top-28">
                <div className="rounded-[2.25rem] border border-white/10 bg-[#151411]/90 p-7 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
                    {product.category}
                  </p>

                  <h1 className="mt-5 text-6xl font-black leading-[0.88] tracking-[-0.04em] text-white md:text-7xl">
                    {product.name}
                  </h1>

                  <p className="mt-6 text-lg leading-8 text-[#c8c4be]/65">
                    {product.description}
                  </p>

                  <div className="mt-8">
                    <p className="text-4xl font-black text-white">
                      {product.price ? formatPrice(product.price) : "Preço em breve"}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <AddToCartButton product={product} />
                    <Button href="/contact" variant="secondary">
                      Reservar
                    </Button>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {trustItems.slice(0, 3).map((item, index) => {
                      const Icon = trustIcons[index] ?? Package;

                      return (
                        <MiniTrust
                          key={`${item.label}-${item.value}`}
                          icon={<Icon size={16} />}
                          label={item.label}
                          value={item.value}
                        />
                      );
                    })}
                  </div>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {product.features.length > 0 && (
        <section className="border-y border-white/10 bg-white/[0.02] px-6 py-20">
          <StaggerReveal className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {product.features.slice(0, 3).map((feature, index) => {
              const Icon = featureIcons[index] ?? Package;

              return (
                <StaggerItem key={`${feature.title}-${index}`}>
                  <Feature
                    icon={<Icon size={22} />}
                    title={feature.title}
                    text={feature.text}
                  />
                </StaggerItem>
              );
            })}
          </StaggerReveal>
        </section>
      )}

      <Reveal>
        <section className="px-6 py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
                Detalhes técnicos
              </p>

              <h2 className="mt-5 max-w-xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white md:text-6xl">
                Detalhes pensados para uso real.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#c8c4be]/65">
                Consulta as características principais deste produto TERR4.
              </p>
            </div>

            <div className="rounded-[2.25rem] border border-white/10 bg-[#151411] p-6">
              {product.specs.length > 0 ? (
                <div className="grid gap-px sm:grid-cols-2">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="group border-t border-white/10 bg-[#151411] p-5 transition-colors duration-200 hover:bg-white/[0.05]"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-white/30">
                        {spec.label}
                      </p>

                      <p className="mt-3 text-lg font-black text-white transition-colors duration-200 group-hover:text-[#f4efe4]">
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-5 text-sm text-[#c8c4be]/55">
                  Detalhes técnicos em breve.
                </p>
              )}
            </div>
          </div>
        </section>
      </Reveal>

      {(product.included.length > 0 || product.compatibility || product.warranty) && (
        <Reveal>
          <section className="bg-[#e8e0d4] px-6 py-24 text-[#2a2520]">
            <StaggerReveal className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
              {product.included.length > 0 && (
                <StaggerItem>
                  <InfoPanel title="Incluído">
                    <div className="space-y-3">
                      {product.included.map((item) => (
                        <div key={item} className="flex items-center gap-3 text-sm">
                          <span className="flex size-7 items-center justify-center rounded-full bg-[#2a2520] text-white">
                            <Check size={14} />
                          </span>

                          <span className="font-bold">{item}</span>
                        </div>
                      ))}
                    </div>
                  </InfoPanel>
                </StaggerItem>
              )}

              {product.compatibility && (
                <StaggerItem>
                  <InfoPanel title="Compatibilidade">
                    <p className="text-sm leading-7 text-[#2a2520]/75">
                      {product.compatibility}
                    </p>
                  </InfoPanel>
                </StaggerItem>
              )}

              {product.warranty && (
                <StaggerItem>
                  <InfoPanel title="Garantia">
                    <p className="text-sm leading-7 text-[#2a2520]/75">
                      {product.warranty}
                    </p>
                  </InfoPanel>
                </StaggerItem>
              )}
            </StaggerReveal>
          </section>
        </Reveal>
      )}

      {product.price && product.status === "available" && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#070706]/92 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a79d8d]">
                {product.name}
              </p>

              <p className="text-xl font-black text-white">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="w-[180px]">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      )}
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
    <div className="stat-shimmer rounded-2xl border-t border-white/15 bg-white/[0.04] p-4 transition-colors duration-200 hover:bg-white/[0.08]">
      <div className="text-[#e8e0d4]">{icon}</div>
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
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
    <div className="card-hover-glow group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#151411] p-7 transition duration-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="text-[#e8e0d4] transition duration-300 group-hover:scale-110 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-black leading-none text-white">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-6 text-[#c8c4be]/60">
        {text}
      </p>
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
    <div className="h-full rounded-[2rem] border border-black/8 bg-[#f1ebe1] p-7">
      <h2 className="text-3xl font-black tracking-[-0.03em] text-[#1a1714]">
        {title}
      </h2>

      <div className="mt-5 text-[#1a1714]/72">{children}</div>
    </div>
  );
}