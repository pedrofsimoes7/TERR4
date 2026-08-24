import Link from "next/link";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminGalleryManager } from "@/components/admin/admin-gallery-manager";
import {
  approveReviewAction,
  rejectReviewAction,
  deleteReviewAction,
  addGalleryImageAction,
  deleteGalleryImageAction,
} from "./actions";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  APPROVED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  REJECTED: "bg-red-500/15 text-red-300 border-red-500/25",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
};

export default async function AdminReviewsPage() {
  const [reviews, gallery] = await Promise.all([
    prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const pending = reviews.filter((r) => r.status === "PENDING");

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">Admin</p>
            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">Galeria & Avaliações</h1>
            <p className="mt-4 text-sm text-white/45">
              {pending.length} avaliaç{pending.length === 1 ? "ão" : "ões"} pendente{pending.length === 1 ? "" : "s"} · {gallery.length} foto{gallery.length === 1 ? "" : "s"} na galeria
            </p>
          </div>
          <Link href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-bold text-white/70 transition hover:bg-white hover:text-neutral-950">
            Dashboard
          </Link>
        </div>

        {/* ── Galeria ── */}
        <div className="mt-12">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Fotos da galeria</h2>
          <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <AdminGalleryManager
              images={gallery.map((g) => ({ id: g.id, url: g.url }))}
              addAction={addGalleryImageAction}
              deleteAction={deleteGalleryImageAction}
            />
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="mt-12">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Avaliações</h2>

          {reviews.length === 0 ? (
            <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">
              <p className="text-white/45">Ainda não há avaliações submetidas.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} size={14}
                            className={n <= review.rating ? "fill-[#c46a2d] text-[#c46a2d]" : "text-white/15"} />
                        ))}
                      </div>
                      <h3 className="mt-2 text-lg font-black text-white">{review.customerName}</h3>
                    </div>
                    <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${STATUS_STYLES[review.status]}`}>
                      {STATUS_LABELS[review.status]}
                    </span>
                  </div>

                  {review.title && <p className="mt-3 font-black text-white">{review.title}</p>}
                  <p className="mt-2 text-sm leading-6 text-white/60">{review.body}</p>
                  <p className="mt-3 text-xs text-white/30">{formatDate(review.createdAt)}</p>

                  <div className="mt-4 flex gap-2">
                    {review.status !== "APPROVED" && (
                      <form action={approveReviewAction} className="flex-1">
                        <input type="hidden" name="id" value={review.id} />
                        <button className="flex h-10 w-full items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-white transition hover:bg-emerald-400">
                          Aprovar
                        </button>
                      </form>
                    )}
                    {review.status !== "REJECTED" && (
                      <form action={rejectReviewAction} className="flex-1">
                        <input type="hidden" name="id" value={review.id} />
                        <button className="flex h-10 w-full items-center justify-center rounded-full border border-white/15 text-sm font-bold text-white/70 transition hover:bg-red-500 hover:text-white">
                          Rejeitar
                        </button>
                      </form>
                    )}
                    <form action={deleteReviewAction}>
                      <input type="hidden" name="id" value={review.id} />
                      <button className="flex h-10 items-center justify-center rounded-full border border-white/15 px-4 text-sm font-bold text-white/40 transition hover:bg-white/10 hover:text-white">
                        Apagar
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}