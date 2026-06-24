import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Truck, Shield, CreditCard, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/reveal";
import { RentalCalendar } from "@/components/ui/rental-calendar";

export const metadata = {
  title: "Alugueres | TERR4",
  description: "Aluga a TERR4 Start. Escolhe as datas e parte à aventura. 40€/dia.",
};

const RENTAL_SLUG = "terr4-start";

export default async function RentalsPage() {
  // Produto alugável
  const product = await prisma.product.findFirst({
    where: { slug: RENTAL_SLUG },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  // Datas reservadas (pendentes + aprovadas)
  let bookedRanges: { start: string; end: string }[] = [];
  if (product) {
    const rentals = await prisma.rental.findMany({
      where: { productId: product.id, status: { in: ["PENDING", "APPROVED"] } },
      select: { startDate: true, endDate: true },
    });
    bookedRanges = rentals.map((r) => ({
      start: r.startDate.toISOString(),
      end: r.endDate.toISOString(),
    }));
  }

  const heroImage = product?.images[0]?.url ?? "/images/terr4/brand-rooftop.jpg";

  return (
    <main className="bg-[#070706] text-[#c8c4be]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroImage} alt="TERR4 Start" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070706] via-[#070706]/70 to-[#070706]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070706]/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-40">
          <Reveal delay={0.05}>
            <p className="mt-10 text-[10px] font-black uppercase tracking-[0.42em] text-[#a79d8d]">
              Aluguer · TERR4 Start
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.9] tracking-[-0.04em] text-white md:text-8xl">
              Aluga a tua<br />aventura.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
              Não precisas de comprar para viver a experiência. Aluga a TERR4 Start
              por 40€/dia e transforma qualquer veículo numa base de aventura.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#a79d8d]">Como funciona</p>
            <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white md:text-6xl">
              Simples, do início ao fim.
            </h2>
          </Reveal>

          <StaggerReveal className="mt-12 grid gap-5 md:grid-cols-4">
            {[
              { icon: <Calendar size={22} />, step: "01", title: "Escolhe as datas", text: "Seleciona o período no calendário. Vês logo o preço total." },
              { icon: <Check size={22} />, step: "02", title: "Preenche o pedido", text: "Deixa os teus dados de contacto e envia o pedido de reserva." },
              { icon: <Truck size={22} />, step: "03", title: "Recolhe e devolve", text: "Combinamos contigo. A recolha e devolução são feitas pelo cliente." },
              { icon: <CreditCard size={22} />, step: "04", title: "Paga na confirmação", text: "O pagamento é feito após confirmarmos a disponibilidade." },
            ].map((s) => (
              <StaggerItem key={s.step}>
                <div className="card-hover-glow group h-full rounded-[1.75rem] border border-white/10 bg-[#151411] p-6 transition duration-300">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#c46a2d] transition group-hover:scale-110">
                      {s.icon}
                    </span>
                    <span className="text-3xl font-black text-white/10">{s.step}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-black text-white">{s.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#c8c4be]/55">{s.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── Calendário + info ── */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#a79d8d]">Reserva</p>
              <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white md:text-5xl">
                Pronto para partir?
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[#c8c4be]/60">
                Escolhe as tuas datas ao lado e envia o pedido. Confirmamos a
                disponibilidade e combinamos a entrega contigo.
              </p>

              <div className="mt-8 space-y-3">
                <InfoLine icon={<CreditCard size={16} />} label="Aluguer" value="40€ / dia" />
                <InfoLine icon={<Shield size={16} />} label="Caução" value="400€ (devolvida)" />
                <InfoLine icon={<Truck size={16} />} label="Entrega" value="Recolha pelo cliente" />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm leading-7 text-[#c8c4be]/60">
                  A caução de 400€ é totalmente devolvida após a verificação do estado
                  do material na devolução.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {product ? (
              <RentalCalendar productId={product.id} bookedRanges={bookedRanges} />
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-[#151411] p-8 text-center text-white/50">
                Aluguer temporariamente indisponível.
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── FAQ aluguer ── */}
      <section className="border-t border-white/8 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#a79d8d]">Dúvidas</p>
            <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white md:text-5xl">
              Perguntas sobre o aluguer.
            </h2>
          </Reveal>

          <StaggerReveal className="mt-10 space-y-4">
            {[
              { q: "Como é feito o pagamento?", a: "O pagamento é feito apenas depois de confirmarmos a disponibilidade das datas que escolheste. Entramos em contacto contigo para combinar." },
              { q: "O que é a caução?", a: "A caução de 400€ é um valor de segurança que garante o bom estado do material. É totalmente devolvida após verificarmos o equipamento na devolução." },
              { q: "Quem trata da entrega?", a: "A recolha e a devolução são feitas pelo cliente. Combinamos contigo o local e horário." },
              { q: "Posso alugar por quantos dias quiser?", a: "Sim. Escolhes o período que precisares no calendário e o valor é calculado automaticamente a 40€/dia." },
            ].map((f) => (
              <StaggerItem key={f.q}>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-lg font-black text-white">{f.q}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#c8c4be]/60">{f.a}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>
    </main>
  );
}

function InfoLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#c46a2d]">
        {icon}
      </span>
      <div className="flex flex-1 items-center justify-between border-b border-white/8 pb-2">
        <span className="text-sm text-[#c8c4be]/55">{label}</span>
        <span className="text-sm font-black text-white">{value}</span>
      </div>
    </div>
  );
}