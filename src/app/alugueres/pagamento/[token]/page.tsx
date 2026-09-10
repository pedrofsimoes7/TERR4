import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { hashRentalToken } from "@/lib/rental-links";
import { RentalEmbeddedCheckout } from "./rental-embedded-checkout";

type PaymentPageProps = {
  params: Promise<{ token: string }>;
};

function formatMoney(cents: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function PaymentUnavailable({ expired = false }: { expired?: boolean }) {
  return (
    <main className="min-h-[100dvh] bg-[#070706] px-6 pb-28 pt-40 text-white">
      <section className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 text-center md:p-12">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
          Pagamento do aluguer
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-6xl">
          {expired ? "Este link expirou." : "Pagamento indisponível."}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/60">
          {expired
            ? "O prazo de 24 horas terminou. Faz um novo pedido para confirmarmos novamente a disponibilidade."
            : "Este pedido já foi concluído ou o link não é válido."}
        </p>
        <Link
          href="/alugueres"
          className="mt-8 inline-flex h-13 items-center justify-center rounded-full bg-[#f4efe4] px-7 text-sm font-black uppercase tracking-[0.1em] text-neutral-950"
        >
          Voltar aos alugueres
        </Link>
      </section>
    </main>
  );
}

export default async function RentalPaymentPage({ params }: PaymentPageProps) {
  const { token } = await params;
  const rental = await prisma.rental.findUnique({
    where: { decisionTokenHash: hashRentalToken(token) },
    include: {
      product: {
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      },
    },
  });

  if (!rental) return <PaymentUnavailable />;

  const paymentExpiresAt = rental.paymentExpiresAt;
  const expired = !paymentExpiresAt || paymentExpiresAt <= new Date();
  if (expired) return <PaymentUnavailable expired />;

  if (rental.status === "PAID" && rental.stripeCheckoutSessionId) {
    redirect(
      `/alugueres/pagamento-confirmado?session_id=${encodeURIComponent(rental.stripeCheckoutSessionId)}`
    );
  }

  if (rental.status !== "AWAITING_PAYMENT" || !rental.stripeCheckoutSessionId) {
    return <PaymentUnavailable />;
  }

  const session = await stripe.checkout.sessions.retrieve(rental.stripeCheckoutSessionId);
  if (session.status === "complete") {
    redirect(
      `/alugueres/pagamento-confirmado?session_id=${encodeURIComponent(session.id)}`
    );
  }
  if (session.status !== "open" || !session.client_secret) {
    return <PaymentUnavailable expired={session.status === "expired"} />;
  }

  const imageUrl = rental.product.images[0]?.url;

  return (
    <main className="min-h-[100dvh] bg-[#070706] px-6 pb-28 pt-40 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
          Checkout do aluguer
        </p>
        <h1 className="mt-4 text-6xl font-black leading-[0.9] tracking-[-0.04em] md:text-8xl">
          Finalizar aluguer.
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white p-3 text-neutral-950 md:p-6">
            <RentalEmbeddedCheckout clientSecret={session.client_secret} />
          </div>

          <aside className="h-fit rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-7 lg:sticky lg:top-28">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a79d8d]">
              Resumo
            </p>

            <div className="mt-6 flex gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-3">
              {imageUrl && (
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={imageUrl}
                    alt={rental.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 py-1">
                <p className="font-black text-white">Aluguer {rental.product.name}</p>
                <p className="mt-2 text-xs leading-5 text-white/45">
                  {formatDate(rental.startDate)} a {formatDate(rental.endDate)}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
              <div className="flex items-center justify-between gap-4 text-white/55">
                <span>Cliente</span>
                <span className="text-right text-white">{rental.customerName}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-white/55">
                <span>Link válido até</span>
                <span className="text-right text-white">
                  {paymentExpiresAt.toLocaleString("pt-PT", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Lisbon",
                  })}
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-white/55">Total</span>
                <span className="text-3xl font-black text-white">
                  {formatMoney(rental.totalCents)}
                </span>
              </div>
              <p className="mt-4 text-center text-xs text-white/30">
                Pagamento seguro integrado por Stripe
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
