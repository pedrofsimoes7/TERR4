"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Check } from "lucide-react";

type BookedRange = { start: string; end: string };

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const PRICE_PER_DAY = 40; // €/dia
const DEPOSIT = 400;      // caução (devolvida após verificação)

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isBetween(day: Date, start: Date, end: Date) {
  const t = day.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export function RentalCalendar({
  productId,
  bookedRanges = [],
}: {
  productId: string;
  bookedRanges?: BookedRange[];
}) {
  const today = startOfDay(new Date());
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const booked = useMemo(
    () => bookedRanges.map((r) => ({ start: startOfDay(new Date(r.start)), end: startOfDay(new Date(r.end)) })),
    [bookedRanges]
  );

  function isBooked(day: Date) {
    return booked.some((r) => isBetween(day, r.start, r.end));
  }
  function isPast(day: Date) {
    return day.getTime() < today.getTime();
  }
  function isDisabled(day: Date) {
    return isPast(day) || isBooked(day);
  }
  function rangeHasConflict(start: Date, end: Date) {
    const s = start.getTime();
    const e = end.getTime();
    return booked.some((r) => s <= r.end.getTime() && e >= r.start.getTime());
  }

  function handleDayClick(day: Date) {
    if (isDisabled(day)) return;
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
      setError(null);
      return;
    }
    if (day.getTime() < rangeStart.getTime()) {
      setRangeStart(day);
      setRangeEnd(null);
      return;
    }
    if (rangeHasConflict(rangeStart, day)) {
      setError("Essas datas incluem dias já reservados. Escolhe outro intervalo.");
      return;
    }
    setRangeEnd(day);
    setError(null);
  }

  const grid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [viewDate]);

  const days = useMemo(() => {
    if (!rangeStart || !rangeEnd) return 0;
    return Math.round((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }, [rangeStart, rangeEnd]);

  const total = days * PRICE_PER_DAY;

  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  const canGoPrev = viewDate.getTime() > new Date(today.getFullYear(), today.getMonth(), 1).getTime();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!rangeStart || !rangeEnd) return;
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      productId,
      startDate: rangeStart.toISOString(),
      endDate: rangeEnd.toISOString(),
      customerName: String(formData.get("name") || ""),
      customerEmail: String(formData.get("email") || ""),
      customerPhone: String(formData.get("phone") || ""),
      notes: String(formData.get("notes") || ""),
      totalCents: total * 100,
      depositCents: DEPOSIT * 100,
    };

    try {
      const res = await fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Falha ao criar reserva");
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
        <h3 className="mt-6 text-3xl font-black tracking-[-0.03em] text-white">Pedido enviado!</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#c8c4be]/60">
          Recebemos o teu pedido de aluguer. Entramos em contacto contigo para confirmar a
          disponibilidade e combinar a entrega. O pagamento é feito após confirmação.
        </p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
          <Row label="Datas" value={`${rangeStart?.toLocaleDateString("pt-PT")} → ${rangeEnd?.toLocaleDateString("pt-PT")}`} />
          <Row label="Dias" value={String(days)} />
          <Row label="Total" value={`${total}€`} />
          <Row label="Caução" value={`${DEPOSIT}€`} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#151411] p-6 md:p-7">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[#c46a2d]">
          <Calendar size={16} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#a79d8d]">Aluguer</p>
          <h3 className="text-lg font-black leading-none text-white">Escolhe as tuas datas</h3>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={prevMonth} disabled={!canGoPrev}
          className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25">
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-black uppercase tracking-[0.15em] text-white">
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </p>
        <button type="button" onClick={nextMonth}
          className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2 text-center text-[10px] font-black uppercase tracking-[0.1em] text-white/25">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const disabled = isDisabled(day);
          const isStart = rangeStart && isSameDay(day, rangeStart);
          const isEnd = rangeEnd && isSameDay(day, rangeEnd);
          const inRange = rangeStart && rangeEnd && isBetween(day, rangeStart, rangeEnd);
          const inHoverRange = rangeStart && !rangeEnd && hoverDate && day.getTime() > rangeStart.getTime() && day.getTime() <= hoverDate.getTime();
          const isSelected = isStart || isEnd;

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(day)}
              onMouseEnter={() => setHoverDate(day)}
              onMouseLeave={() => setHoverDate(null)}
              className={`relative aspect-square rounded-xl text-sm font-bold transition-all duration-150
                ${disabled ? "cursor-not-allowed text-white/15 line-through" : "text-white/70 hover:bg-white/10"}
                ${isSelected ? "!bg-[#c46a2d] !text-white" : ""}
                ${inRange && !isSelected ? "bg-[#c46a2d]/20 text-white" : ""}
                ${inHoverRange ? "bg-white/8" : ""}`}
            >
              {day.getDate()}
              {isBooked(day) && !isPast(day) && (
                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-red-400/70" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] font-bold text-white/30">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#c46a2d]" /> Selecionado</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-red-400/70" /> Reservado</span>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden">
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rangeStart && rangeEnd && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-5 border-t border-white/10 pt-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Row label="Datas" value={`${rangeStart.toLocaleDateString("pt-PT")} → ${rangeEnd.toLocaleDateString("pt-PT")}`} />
              <Row label="Dias" value={String(days)} />
              <div className="my-3 h-px bg-white/8" />
              <Row label={`${days} × ${PRICE_PER_DAY}€/dia`} value={`${total}€`} />
              <Row label="Caução (devolvida)" value={`${DEPOSIT}€`} muted />
              <div className="my-3 h-px bg-white/8" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-white">Total do aluguer</span>
                <span className="text-2xl font-black text-white">{total}€</span>
              </div>
            </div>

            <p className="mt-3 text-center text-[11px] leading-5 text-white/30">
              Pagamento após confirmação · Caução de {DEPOSIT}€ devolvida após verificação do material
            </p>

            {!showForm ? (
              <button type="button" onClick={() => setShowForm(true)}
                className="btn-wipe mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[#f4efe4] text-sm font-black uppercase tracking-[0.1em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]">
                Continuar
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input name="name" required placeholder="Nome completo"
                  className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-white outline-none placeholder:text-white/30 focus:border-[#c46a2d]/60" />
                <input name="email" type="email" required placeholder="Email"
                  className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-white outline-none placeholder:text-white/30 focus:border-[#c46a2d]/60" />
                <input name="phone" placeholder="Telefone"
                  className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-white outline-none placeholder:text-white/30 focus:border-[#c46a2d]/60" />
                <textarea name="notes" rows={3} placeholder="Notas (opcional)"
                  className="w-full resize-none rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4 text-white outline-none placeholder:text-white/30 focus:border-[#c46a2d]/60" />
                <button type="submit" disabled={submitting}
                  className="btn-wipe flex h-12 w-full items-center justify-center rounded-full bg-[#f4efe4] text-sm font-black uppercase tracking-[0.1em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white active:scale-[0.98] disabled:opacity-50">
                  {submitting ? "A enviar..." : "Pedir reserva"}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={`text-xs ${muted ? "text-white/35" : "text-white/55"}`}>{label}</span>
      <span className={`text-sm font-bold ${muted ? "text-white/45" : "text-white"}`}>{value}</span>
    </div>
  );
}