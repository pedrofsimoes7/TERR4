"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export function CartLink() {
  const count = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <Link
      href="/cart"
      className="relative flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white hover:text-neutral-950"
      aria-label="Carrinho"
    >
      <ShoppingBag size={18} />

      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-white text-[11px] font-black text-neutral-950">
          {count}
        </span>
      )}
    </Link>
  );
}