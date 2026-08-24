"use client";

import { useActionState } from "react";
import { createPromotionAction, type PromotionState } from "@/app/admin/promotions/actions";
import { formatPrice } from "@/lib/utils";

type ProductOption = {
  id: string;
  name: string;
  priceCents: number | null;
};

export function PromotionForm({ products }: { products: ProductOption[] }) {
  const [state, formAction, pending] = useActionState<PromotionState, FormData>(
    createPromotionAction,
    null
  );

  return (
    <form action={formAction} className="grid gap-5">
      <div>
        <label className="text-sm font-bold text-white/70">Produto</label>
        <select
          name="productId"
          required
          className="mt-2 h-13 w-full rounded-full border border-white/10 bg-neutral-900 px-5 text-white outline-none"
        >
          <option value="">Escolhe um produto...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.priceCents ? ` — ${formatPrice(p.priceCents / 100)}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-white/70">
            Preço promocional (€)
          </label>
          <input
            name="salePrice"
            type="number"
            step="0.01"
            required
            placeholder="Ex: 999.00"
            className="mt-2 h-13 w-full rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/30 focus:border-[#c46a2d]/50"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-white/70">
            Termina em
          </label>
          <input
            name="endsAt"
            type="datetime-local"
            required
            className="mt-2 h-13 w-full rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none focus:border-[#c46a2d]/50"
          />
        </div>
      </div>

      {state?.error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3">
          <p className="text-sm text-red-300">{state.error}</p>
        </div>
      )}

      {state?.success && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3">
          <p className="text-sm text-emerald-300">{state.success}</p>
        </div>
      )}

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-5 py-3">
        <p className="text-xs leading-5 text-amber-200/80">
          Ao criar a promoção, todos os clientes que autorizaram marketing
          recebem um email automático com o desconto. O preço promocional
          aparece no site (riscado) até à data de fim.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex h-13 items-center justify-center rounded-full bg-[#c46a2d] px-6 text-sm font-black text-white transition hover:bg-[#d4853f] active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "A criar e a enviar emails..." : "Criar promoção e avisar clientes"}
      </button>
    </form>
  );
}