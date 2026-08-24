import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminRentalsCalendar } from "@/components/admin/admin-rentals-calendar";
import { approveRentalAction, rejectRentalAction, cancelRentalAction } from "./actions";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CANCELLED: "Cancelado",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  APPROVED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  REJECTED: "bg-red-500/15 text-red-300 border-red-500/25",
  CANCELLED: "bg-white/10 text-white/40 border-white/15",
};

export default async function AdminRentalsPage() {
  const rentals = await prisma.rental.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  const calendarData = rentals.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString(),
    status: r.status,
  }));

  const pending = rentals.filter((r) => r.status === "PENDING");
  const upcoming = rentals.filter((r) => r.status === "APPROVED");

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">Admin</p>
            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">Alugueres</h1>
            <p className="mt-4 text-sm text-white/45">
              {pending.length} pendente{pending.length === 1 ? "" : "s"} · {upcoming.length} aprovado{upcoming.length === 1 ? "" : "s"}
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-bold text-white/70 transition hover:bg-white hover:text-neutral-950"
          >
            Dashboard
          </Link>
        </div>

        {rentals.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">
            <h2 className="text-2xl font-black">Sem alugueres ainda</h2>
            <p className="mt-4 text-white/45">Os pedidos de aluguer vão aparecer aqui.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Calendar */}
            <div>
              <AdminRentalsCalendar rentals={calendarData} />
            </div>

            {/* List */}
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">
                Todos os pedidos
              </h2>

              {rentals.map((rental) => {
                const nights = Math.round(
                  (rental.endDate.getTime() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <article
                    key={rental.id}
                    className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-white">{rental.customerName}</h3>
                        <a href={`mailto:${rental.customerEmail}`} className="mt-1 block text-sm text-white/50 transition hover:text-white">
                          {rental.customerEmail}
                        </a>
                        {rental.customerPhone && (
                          <p className="text-sm text-white/50">{rental.customerPhone}</p>
                        )}
                      </div>

                      <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${STATUS_STYLES[rental.status]}`}>
                        {STATUS_LABELS[rental.status]}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/8 bg-black/20 p-4">
                      <Detail label="Check-in" value={formatDate(rental.startDate)} />
                      <Detail label="Check-out" value={formatDate(rental.endDate)} />
                      <Detail label="Noites" value={String(nights)} />
                      <Detail label="Total" value={formatPrice(rental.totalCents)} />
                      <Detail label="Caução" value={formatPrice(rental.depositCents)} />
                      <Detail label="Produto" value={rental.product.name} />
                    </div>

                    {rental.notes && (
                      <p className="mt-3 rounded-xl border border-white/8 bg-black/20 px-4 py-3 text-sm leading-6 text-white/55">
                        {rental.notes}
                      </p>
                    )}

                    {/* Actions */}
                    {rental.status === "PENDING" && (
                      <div className="mt-4 flex gap-2">
                        <form action={approveRentalAction} className="flex-1">
                          <input type="hidden" name="id" value={rental.id} />
                          <button className="flex h-11 w-full items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-white transition hover:bg-emerald-400">
                            Aprovar
                          </button>
                        </form>
                        <form action={rejectRentalAction} className="flex-1">
                          <input type="hidden" name="id" value={rental.id} />
                          <button className="flex h-11 w-full items-center justify-center rounded-full border border-white/15 text-sm font-bold text-white/70 transition hover:bg-red-500 hover:text-white">
                            Rejeitar
                          </button>
                        </form>
                      </div>
                    )}

                    {rental.status === "APPROVED" && (
                      <form action={cancelRentalAction} className="mt-4">
                        <input type="hidden" name="id" value={rental.id} />
                        <button className="flex h-10 w-full items-center justify-center rounded-full border border-white/15 text-xs font-bold text-white/50 transition hover:bg-white/10 hover:text-white">
                          Cancelar reserva
                        </button>
                      </form>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}