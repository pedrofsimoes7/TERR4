import Link from "next/link";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { customerLogoutAction } from "./actions";

export default async function AccountPage() {
  const session = await getCustomerSession();

  if (!session) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-36 text-white">
        <section className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
            Conta
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
            Área de cliente.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Entra ou cria conta para acompanhar encomendas, histórico de compras
            e novidades da TERR4.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/account/login"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950 transition hover:bg-stone-200"
            >
              Entrar
            </Link>

            <Link
              href="/account/register"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-black text-white transition hover:bg-white hover:text-neutral-950"
            >
              Criar conta
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const customer = await prisma.customerUser.findUnique({
    where: {
      id: session.customerId,
    },
    include: {
        orders: {
            where: {
                OR: [
                    { customerUserId: session.customerId },
                    { customerEmail: session.email },
                ],
            },
            include: {
                items: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        },
    },
  });

  if (!customer) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-36 text-white">
        <section className="mx-auto max-w-4xl">
          <h1 className="text-5xl font-black tracking-tight">
            Sessão inválida.
          </h1>

          <Link
            href="/account/login"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950"
          >
            Entrar novamente
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Conta
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Olá{customer.name ? `, ${customer.name}` : ""}.
            </h1>
          </div>

          <form action={customerLogoutAction}>
            <button
              type="submit"
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold text-white/70 transition hover:bg-white hover:text-neutral-950"
            >
              Logout
            </button>
          </form>
        </div>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
          Aqui podes acompanhar as tuas encomendas e histórico TERR4.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Stat label="Email" value={customer.email} />
          <Stat label="Encomendas" value={customer.orders.length.toString()} />
          <Stat
            label="Última compra"
            value={
              customer.orders[0]
                ? customer.orders[0].createdAt.toLocaleDateString("pt-PT")
                : "—"
            }
          />
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-2xl font-black">As tuas encomendas</h2>
          </div>

          {customer.orders.length === 0 ? (
            <div className="p-8">
              <p className="text-white/55">
                Ainda não tens encomendas associadas a esta conta.
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950"
              >
                Ver produtos
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="grid gap-5 px-6 py-5 md:grid-cols-[1fr_140px_140px]"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      #{order.id.slice(0, 8)}
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      {order.items.map((item) => item.name).join(", ")}
                    </h3>

                    <p className="mt-1 text-sm text-white/45">
                      {order.createdAt.toLocaleDateString("pt-PT")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                      Estado
                    </p>
                    <p className="mt-2 font-bold">{order.status}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                      Total
                    </p>
                    <p className="mt-2 font-bold">
                      {formatPrice(order.totalCents / 100)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-4 break-words text-xl font-black">{value}</p>
    </div>
  );
}