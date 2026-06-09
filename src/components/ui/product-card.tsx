import Image from "next/image";
import Link from "next/link";
import { StoreProduct } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#151411] transition duration-500 hover:-translate-y-1 hover:border-white/20"
    >
      <div className="relative overflow-hidden bg-black">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={1400}
          height={1000}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[4/3] object-cover transition duration-700 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        <span className="absolute left-5 top-5 rounded-full border border-green-300/15 bg-[#2d4a2d]/80 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-green-100 backdrop-blur">
          {product.status === "available" ? "Disponível" : "Brevemente"}
        </span>

        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 backdrop-blur-[2px] transition duration-500 group-hover:opacity-100">
          <span className="rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-neutral-950">
            Ver produto →
          </span>
        </div>
      </div>

      <div className="relative p-7 md:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/35">
              {product.category}
            </p>

            <h2 className="mt-3 text-4xl font-black leading-none tracking-[-0.03em] text-white">
              {product.name}
            </h2>
          </div>

          <p className="shrink-0 text-2xl font-black text-white">
            {product.price ? formatPrice(product.price) : "—"}
          </p>
        </div>

        <p className="mt-6 max-w-xl text-base leading-7 text-[#c8c4be]/65">
          {product.shortDescription}
        </p>
      </div>
    </Link>
  );
}