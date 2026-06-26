"use client";

import { useState } from "react";
import { BellRing, Check, Loader2 } from "lucide-react";
import { StoreProduct } from "@/lib/products";

export function ReserveButton({ product }: { product: StoreProduct }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Preenche o nome e o email.");
      return;
    }
    if (!email.includes("@")) {
      setError("Email inválido.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          customerName: name.trim(),
          customerEmail: email.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Não foi possível registar a reserva.");
      }

      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#2d4a2d] px-6 text-sm font-black uppercase tracking-[0.1em] text-green-100">
        <Check size={15} />
        Reserva confirmada
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-wipe group flex h-12 items-center justify-center gap-2 rounded-full border border-[#c46a2d]/40 bg-[#c46a2d]/12 px-6 text-sm font-black uppercase tracking-[0.1em] text-[#f4efe4] transition-all duration-300 hover:bg-[#c46a2d]/20 active:scale-[0.97]"
      >
        <BellRing size={15} className="transition duration-300 group-hover:scale-110" />
        Reservar
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4">
      <p className="text-sm font-bold text-white">Sem stock de momento</p>
      <p className="mt-1 text-xs leading-5 text-white/55">
        Deixa os teus dados e avisamos-te assim que houver stock disponível.
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-full border border-white/12 bg-white/[0.05] px-4 text-sm text-white placeholder:text-white/35 focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-full border border-white/12 bg-white/[0.05] px-4 text-sm text-white placeholder:text-white/35 focus:outline-none"
        />

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="btn-wipe mt-1 flex h-11 items-center justify-center gap-2 rounded-full bg-[#f4efe4] px-5 text-sm font-black uppercase tracking-[0.1em] text-neutral-950 transition hover:bg-white disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              A reservar...
            </>
          ) : (
            "Confirmar reserva"
          )}
        </button>
      </div>
    </div>
  );
}