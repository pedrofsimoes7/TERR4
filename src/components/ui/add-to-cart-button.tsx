"use client";

import { StoreProduct } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";

export function AddToCartButton({ product }: { product: StoreProduct }) {
    const addItem = useCartStore((state) => state.addItem);

  if (product.status !== "available") {
    return (
      <button
        disabled
        className="h-12 rounded-full bg-white/10 px-6 text-sm font-bold text-white/40"
      >
        Brevemente
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="h-12 rounded-full bg-white px-6 text-sm font-bold text-neutral-950 transition hover:bg-stone-200"
    >
      Adicionar ao carrinho
    </button>
  );
}