"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import { createReviewAction } from "./actions";

export function ReviewFormToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 w-full rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-[#c46a2d]/50 hover:bg-white/[0.05]"
      >
        <span className="block text-sm font-black text-white">
          Já viajaste com a TERR4?
        </span>
        <span className="mt-1 block text-xs text-white/45">
          Conta-nos como foi →
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#151411] p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 text-white/40 transition hover:text-white"
            >
              <X size={20} />
            </button>

            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#a79d8d]">
              A tua experiência
            </p>

            <h3 className="mt-3 text-2xl font-black text-white">
              Deixa a tua avaliação
            </h3>

            <form action={createReviewAction} className="mt-6 grid gap-5">
              <input
                name="customerName"
                required
                maxLength={80}
                placeholder="O teu nome"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#c46a2d]"
              />

              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                  Classificação
                </p>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        required
                        className="peer sr-only"
                      />

                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/40 transition hover:border-[#c46a2d] peer-checked:border-[#c46a2d] peer-checked:bg-[#c46a2d] peer-checked:text-white">
                        <Star size={16} />
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <textarea
                name="body"
                required
                maxLength={1000}
                rows={4}
                placeholder="Conta-nos como foi a tua experiência..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#c46a2d]"
              />

              <button
                type="submit"
                className="w-fit rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#c46a2d] hover:text-white"
              >
                Publicar avaliação
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}