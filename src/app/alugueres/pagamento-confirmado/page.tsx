import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function RentalPaymentConfirmedPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;
  let paid = false;
  let processing = false;

  if (sessionId?.startsWith("cs_")) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const rentalId = session.metadata?.rentalId;
      if (rentalId && session.metadata?.paymentType === "rental") {
        const rental = await prisma.rental.findUnique({ where: { id: rentalId } });
        paid = session.payment_status === "paid" && rental?.status === "PAID";
        processing = session.payment_status === "paid" && rental?.status === "AWAITING_PAYMENT";
      }
    } catch (error) {
      console.error("Erro ao validar confirmação do aluguer:", error);
    }
  }

  const title = paid
    ? "A tua reserva está confirmada."
    : processing
      ? "Pagamento em confirmação."
      : "Não foi possível confirmar o pagamento.";
  const text = paid
    ? "Receberás um email de confirmação muito em breve. A equipa TERR4 entrará em contacto contigo para organizar a recolha."
    : processing
      ? "O pagamento foi aceite pela Stripe e estamos a concluir a reserva. Atualiza esta página dentro de alguns instantes."
      : "Esta página não contém uma confirmação de pagamento válida. Verifica o email ou contacta a equipa TERR4 antes de repetir o pagamento.";

  return (
    <main className="min-h-screen bg-[#070706] px-6 py-20 text-white">
      <section className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a79d8d]">
          {paid ? "Pagamento recebido" : processing ? "A confirmar" : "Pagamento não confirmado"}
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">{title}</h1>
        <p className="mt-5 leading-7 text-white/60">{text}</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-[#f4efe4] px-5 py-3 text-sm font-black text-neutral-950">
          Voltar ao site
        </Link>
      </section>
    </main>
  );
}
