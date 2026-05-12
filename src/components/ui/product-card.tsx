import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]"
    >
      <div className="relative overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={1200}
          height={900}
          className="aspect-[4/3] object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-5 top-5 rounded-full bg-black/65 px-4 py-2 text-xs font-bold backdrop-blur">
          {product.status === "available" ? "Disponível" : "Brevemente"}
        </span>
      </div>

      <div className="p-7">
        <p className="text-sm text-white/45">{product.category}</p>
        <h2 className="mt-2 text-3xl font-black">{product.name}</h2>
        <p className="mt-4 text-sm leading-6 text-white/60">
          {product.shortDescription}
        </p>
        <p className="mt-6 text-lg font-bold">
          {product.price ? formatPrice(product.price) : "Preço em breve"}
        </p>
      </div>
    </Link>
  );
}