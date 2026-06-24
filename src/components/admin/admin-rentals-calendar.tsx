"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Rental = {
  id: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
};

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/80",
  APPROVED: "bg-emerald-500/80",
  REJECTED: "bg-red-500/60",
  CANCELLED: "bg-white/20",
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isBetween(day: Date, start: Date, end: Date) {
  const t = day.getTime();
  return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime();
}

export function AdminRentalsCalendar({ rentals }: { rentals: Rental[] }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // Only show active bookings on calendar
  const activeRentals = useMemo(
    () => rentals.filter((r) => r.status === "PENDING" || r.status === "APPROVED"),
    [rentals]
  );

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

  function rentalsOnDay(day: Date) {
    return activeRentals.filter((r) =>
      isBetween(day, new Date(r.startDate), new Date(r.endDate))
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black text-white">
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="rounded-full border border-white/10 px-4 text-xs font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Hoje
          </button>
          <button
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="mb-2 grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-center text-[10px] font-black uppercase tracking-[0.1em] text-white/25">
            {w}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1.5">
        {grid.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;

          const dayRentals = rentalsOnDay(day);
          const isToday =
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear();

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[72px] rounded-xl border p-2 transition-colors
                ${isToday ? "border-[#c46a2d]/50 bg-[#c46a2d]/5" : "border-white/8 bg-black/20"}`}
            >
              <span className={`text-xs font-bold ${isToday ? "text-[#c46a2d]" : "text-white/40"}`}>
                {day.getDate()}
              </span>
              <div className="mt-1 space-y-1">
                {dayRentals.slice(0, 2).map((r) => (
                  <div
                    key={r.id}
                    title={`${r.customerName} (${r.status})`}
                    className={`truncate rounded-md px-1.5 py-0.5 text-[9px] font-bold text-white ${STATUS_COLORS[r.status]}`}
                  >
                    {r.customerName.split(" ")[0]}
                  </div>
                ))}
                {dayRentals.length > 2 && (
                  <div className="text-[9px] font-bold text-white/40">+{dayRentals.length - 2}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap items-center gap-4 text-[10px] font-bold text-white/40">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-amber-500/80" /> Pendente</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-emerald-500/80" /> Aprovado</span>
      </div>
    </div>
  );
}