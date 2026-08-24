import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { hashRentalToken } from "@/lib/rental-links";

type PageProps = {
  params: Promise<{ token: string }>;
};

export const dynamic = "force-dynamic";

export default async function RentalDecisionPage({ params }: PageProps) {
  const { token } = await params;
  const rental = await prisma.rental.findUnique({
    where: { decisionTokenHash: hashRentalToken(token) },
    include: { product: true },
  });

  if (!rental) return <DecisionMessage title="Link inválido" text="Este link já não está disponível." />;

  const now = new Date();
  if (rental.status === "PENDING_APPROVAL" && (!rental.decisionExpiresAt || rental.decisionExpiresAt <= now)) {
    await prisma.rental.update({ where: { id: rental.id }, data: { status: "EXPIRED" } });
    return <DecisionMessage title="Pedido expirado" text="O prazo para decidir este pedido terminou e as datas foram libertadas." />;
  }

  if (rental.status === "AWAITING_PAYMENT") {
    return <DecisionMessage title="Pagamento enviado" text="O cliente recebeu o link de pagamento. A reserva mantém-se bloqueada durante 24 horas." />;
  }
  if (rental.status === "PAID") {
    return <DecisionMessage title="Aluguer confirmado" text="O pagamento foi recebido. Contacta o cliente para organizar a recolha." />;
  }
  if (rental.status === "REJECTED") {
    return <DecisionMessage title="Pedido recusado" text="O cliente foi informado e as datas voltaram a ficar disponíveis." />;
  }
  if (rental.status === "EXPIRED" || rental.status === "CANCELLED") {
    return <DecisionMessage title="Pedido indisponível" text="Este pedido já não pode ser tratado." />;
  }

  return (
    <main className="min-h-screen bg-[#070706] px-6 py-20 text-white">
      <section className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a79d8d]">Pedido de aluguer</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">Decidir disponibilidade</h1>
        <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/70">
          <p><strong className="text-white">Cliente:</strong> {rental.customerName}</p>
          <p><strong className="text-white">Produto:</strong> {rental.product.name}</p>
          <p><strong className="text-white">Datas:</strong> {rental.startDate.toLocaleDateString("pt-PT")} → {rental.endDate.toLocaleDateString("pt-PT")}</p>
          <p><strong className="text-white">Total:</strong> {(rental.totalCents / 100).toFixed(2)}€</p>
        </div>
        <p className="mt-6 text-sm leading-6 text-white/55">Ao confirmar, o cliente recebe um link Stripe válido por 24 horas para pagar o aluguer. A caução continua a ser cobrada na recolha.</p>
        <form action={`/api/rentals/decision/${token}`} method="post" className="mt-8 grid gap-3 sm:grid-cols-2">
          <button name="decision" value="approve" className="rounded-full bg-[#f4efe4] px-5 py-3 text-sm font-black text-neutral-950 transition hover:bg-white">Confirmar disponibilidade</button>
          <button name="decision" value="reject" className="rounded-full border border-red-400/35 px-5 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/15">Recusar pedido</button>
        </form>
      </section>
    </main>
  );
}

function DecisionMessage({ title, text }: { title: string; text: string }) {
  return (
    <main className="min-h-screen bg-[#070706] px-6 py-20 text-white">
      <section className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="mt-4 leading-7 text-white/60">{text}</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-[#f4efe4] px-5 py-3 text-sm font-black text-neutral-950">Voltar ao site</Link>
      </section>
    </main>
  );
}
