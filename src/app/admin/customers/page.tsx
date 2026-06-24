import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CopyCustomerEmailsButton } from "@/components/admin/copy-customer-emails-button";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default async function AdminCustomersPage() {
  const customers = await prisma.customerUser.findMany({
    include: {
      orders: {
        where: {
          status: {
            in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const emails = customers.map((customer) => customer.email);

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Admin
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Clientes
            </h1>

            <p className="mt-4 text-sm text-white/45">
              {customers.length} cliente{customers.length === 1 ? "" : "s"} registado
              {customers.length === 1 ? "" : "s"}.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <CopyCustomerEmailsButton emails={emails} />

            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-bold text-white/70 transition hover:bg-white hover:text-neutral-950"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">
            <h2 className="text-2xl font-black">Ainda não existem clientes</h2>

            <p className="mt-4 text-white/45">
              Os clientes aparecem aqui automaticamente quando criarem conta.
            </p>
          </div>
        ) : (
          <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
            <div className="hidden grid-cols-[1.1fr_1.4fr_0.8fr_0.8fr_0.8fr] border-b border-white/10 px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-white/30 md:grid">
              <span>Nome</span>
              <span>Email</span>
              <span>Registo</span>
              <span>Encomendas</span>
              <span>Total gasto</span>
            </div>

            <div className="divide-y divide-white/10">
              {customers.map((customer) => {
                const totalSpent = customer.orders.reduce(
                  (total, order) => total + order.totalCents,
                  0
                );

                return (
                  <div
                    key={customer.id}
                    className="grid gap-4 px-6 py-5 md:grid-cols-[1.1fr_1.4fr_0.8fr_0.8fr_0.8fr] md:items-center"
                  >
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/25 md:hidden">
                        Nome
                      </p>
                      <p className="font-black text-white">
                        {customer.name || "Sem nome"}
                      </p>
                      {!customer.emailVerifiedAt && (
                        <p className="mt-1 text-xs text-amber-300/70">
                          Email por confirmar
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/25 md:hidden">
                        Email
                      </p>
                      <a
                        href={`mailto:${customer.email}`}
                        className="text-sm text-white/60 transition hover:text-white"
                      >
                        {customer.email}
                      </a>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/25 md:hidden">
                        Registo
                      </p>
                      <p className="text-sm text-white/55">
                        {formatDate(customer.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/25 md:hidden">
                        Encomendas
                      </p>
                      <p className="text-sm font-bold text-white">
                        {customer.orders.length}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/25 md:hidden">
                        Total gasto
                      </p>
                      <p className="text-sm font-bold text-white">
                        {formatPrice(totalSpent)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}