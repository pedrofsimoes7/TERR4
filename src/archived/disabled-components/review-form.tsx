"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check } from "lucide-react";

export function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      setError("Escolhe uma classificação de estrelas.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      customerName: String(formData.get("name") || ""),
      title: String(formData.get("title") || ""),
      body: String(formData.get("body") || ""),
      rating,
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Algo correu mal. Tenta novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-[#151411] p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#2d4a2d]/50 bg-[#2d4a2d]/25 text-green-300">
          <Check size={28} />
        </div>
        <h3 className="mt-6 text-2xl font-black tracking-[-0.03em] text-white">Obrigado!</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#c8c4be]/60">
          A tua avaliação foi enviada e será publicada após revisão. Agradecemos a partilha da tua experiência.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-[#151411] p-6 md:p-8">
      <h3 className="text-2xl font-black tracking-[-0.03em] text-white">Deixa a tua avaliação</h3>
      <p className="mt-2 text-sm text-[#c8c4be]/55">Partilha a tua experiência com a TERR4.</p>

      {/* estrelas */}
      <div className="mt-6">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Classificação</label>
        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { setRating(n); setError(null); }}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform duration-150 hover:scale-110"
              aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
            >
              <Star
                size={32}
                className={`transition-colors duration-150 ${
                  n <= (hover || rating) ? "fill-[#c46a2d] text-[#c46a2d]" : "text-white/20"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <input name="name" required placeholder="O teu nome"
          className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-white outline-none placeholder:text-white/30 focus:border-[#c46a2d]/60" />
        <input name="title" placeholder="Título (opcional)"
          className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-white outline-none placeholder:text-white/30 focus:border-[#c46a2d]/60" />
        <textarea name="body" required rows={4} placeholder="Conta-nos a tua experiência..."
          className="w-full resize-none rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4 text-white outline-none placeholder:text-white/30 focus:border-[#c46a2d]/60" />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" disabled={submitting}
        className="btn-wipe mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#f4efe4] text-sm font-black uppercase tracking-[0.1em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white active:scale-[0.98] disabled:opacity-50">
        {submitting ? "A enviar..." : "Enviar avaliação"}
      </button>
    </form>
  );
}