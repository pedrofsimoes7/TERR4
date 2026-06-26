"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { StoreProduct } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";

export function AddToCartButton({ product }: { product: StoreProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`btn-wipe group flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-black uppercase tracking-[0.1em] transition-all duration-300 active:scale-[0.97] ${
        added
          ? "bg-[#2d4a2d] text-green-100"
          : "bg-white text-neutral-950 hover:-translate-y-0.5 hover:bg-stone-100"
      }`}
    >
      {added ? (
        <>
          <Check size={15} />
          Adicionado
        </>
      ) : (
        <>
          <ShoppingBag size={15} className="transition duration-300 group-hover:scale-110" />
          Adicionar ao carrinho
        </>
      )}
    </button>
  );
}