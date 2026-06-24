import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/reveal";
import { GalleryCarousel } from "@/components/ui/gallery-carousel";
import { ReviewForm } from "@/components/ui/review-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galeria e Avaliações | TERR4",
  description:
    "Vê a TERR4 em ação e lê as avaliações de quem já viveu a aventura. Partilha também a tua experiência.",
};

function formatDatePT(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export default async function GalleryPage() {
  const [galleryImages, reviews] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.review.findMany({ where: { status: "APPROVED" }, orderBy: { createdAt: "desc" } }),
  ]);

  const gallery = galleryImages.map((g) => ({ id: g.id, url: g.url, alt: g.alt }));

  const avg =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <main className="bg-[#070706] text-[#c8c4be]">
      {/* ── Hero ── */}
      <section className="px-6 pb-12 pt-40">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-[10px] font-black uppercase tracking-[0.42em] text-[#a79d8d]">
              Galeria · Comunidade
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.88] tracking-[-0.04em] text-white md:text-8xl">
              A aventura,<br />em imagens.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
              Momentos reais de quem leva a TERR4 para a estrada. Vê a galeria e lê as
              experiências da nossa comunidade.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Carrossel ── */}
      <section className="pb-24 pl-6">
        <div className="mx-auto max-w-7xl pr-6">
          <GalleryCarousel images={gallery} />
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="border-t border-white/8 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#a79d8d]">Avaliações</p>
                <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white md:text-6xl">
                  O que dizem<br />os aventureiros.
                </h2>
              </div>

              {avg && (
                <div className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-[#151411] px-6 py-4">
                  <span className="text-5xl font-black text-white">{avg}</span>
                  <div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={16}
                          className={n <= Math.round(Number(avg)) ? "fill-[#c46a2d] text-[#c46a2d]" : "text-white/20"} />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-white/45">{reviews.length} avaliações</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            {/* lista de reviews */}
            <div>
              {reviews.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-white/12 bg-white/[0.02] p-12 text-center">
                  <h3 className="text-xl font-black text-white">Ainda sem avaliações</h3>
                  <p className="mt-3 text-sm text-white/45">Sê o primeiro a partilhar a tua experiência.</p>
                </div>
              ) : (
                <StaggerReveal className="grid gap-4 sm:grid-cols-2">
                  {reviews.map((review) => (
                    <StaggerItem key={review.id}>
                      <article className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-[#151411] p-6">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} size={14}
                              className={n <= review.rating ? "fill-[#c46a2d] text-[#c46a2d]" : "text-white/15"} />
                          ))}
                        </div>
                        {review.title && (
                          <h3 className="mt-4 text-lg font-black leading-tight text-white">{review.title}</h3>
                        )}
                        <p className="mt-3 flex-1 text-sm leading-7 text-[#c8c4be]/65">{review.body}</p>
                        <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
                          <span className="text-sm font-black text-white">{review.customerName}</span>
                          <span className="text-xs text-white/35">{formatDatePT(review.createdAt)}</span>
                        </div>
                      </article>
                    </StaggerItem>
                  ))}
                </StaggerReveal>
              )}
            </div>

            {/* form */}
            <div className="lg:sticky lg:top-28">
              <Reveal delay={0.1}>
                <ReviewForm />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}