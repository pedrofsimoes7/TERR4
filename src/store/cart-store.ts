"use client";

import { create } from "zustand";
import { Product } from "@/data/products";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.product.slug === product.slug);

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.slug === product.slug
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { product, quantity: 1 }],
      };
    }),
  removeItem: (slug) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.slug !== slug),
    })),
  clearCart: () => set({ items: [] }),
}));