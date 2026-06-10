import Link from "next/link";
import { ArrowUpRight, Lock, UserPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { customerLogoutAction } from "./actions";

export default async function AccountPage() {
  const session = await getCustomerSession();

if (session) {
  const customer = await prisma.customerUser.findUnique({
    where: {
      id: session.customerId,
    },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const totalSpent =
    customer?.orders.reduce(
      (sum, order) => sum + order.totalCents,
      0
    ) ?? 0;

  return (
    <main className="min-h-screen bg-[#070706] px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-7xl">
        <h1 className="text-5xl font-black tracking-[-0.04em] md:text-7xl">
          Olá{customer?.name ? `, ${customer.name}` : ""}.
        </h1>

        <p className="mt-5 text-lg text-[#c8c4be]/60">
          Bem-vindo à tua área pessoal TERR4.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Stat
            label="Encomendas"
            value={String(customer?.orders.length ?? 0)}
          />

          <Stat
            label="Total gasto"
            value={`€${(totalSpent / 100).toFixed(0)}`}
          />

          <Stat
            label="Conta"
            value={
              customer?.createdAt
                ? new Intl.DateTimeFormat("pt-PT", {
                    month: "short",
                    year: "numeric",
                  }).format(customer.createdAt)
                : "-"
            }
          />
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-2xl font-black">
              As tuas encomendas
            </h2>
          </div>

          {customer?.orders.length ? (
            <div className="divide-y divide-white/10">
              {customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-6 py-5"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      {new Intl.DateTimeFormat("pt-PT").format(
                        order.createdAt
                      )}
                    </p>

                    <h3 className="mt-2 font-black">
                      #{order.id.slice(-8)}
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      €{(order.totalCents / 100).toFixed(2)}
                    </p>

                    <p className="mt-1 text-sm text-white/45">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-white/45">
              Ainda não existem encomendas.
            </div>
          )}
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-black">
            Dados da conta
          </h2>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                Email
              </p>

              <p className="mt-1">{customer?.email}</p>
            </div>

            {customer?.name && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                  Nome
                </p>

                <p className="mt-1">{customer.name}</p>
              </div>
            )}
          </div>

          <form action={customerLogoutAction} className="mt-8">
            <button
              type="submit"
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-black text-white/70 transition hover:bg-white hover:text-neutral-950"
            >
              Terminar sessão
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
  return (
    <main className="min-h-screen bg-[#070706] px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-6xl">
        

        <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.04em] md:text-7xl">
          Área de cliente.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c8c4be]/60">
          Acompanha encomendas, guarda os teus dados e recebe atualizações da TERR4.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <AccountCard
            icon={<Lock size={22} />}
            label="Já tenho conta"
            title="Entrar"
            text="Acede à tua área pessoal para consultar encomendas e dados da conta."
            href="/account/login"
            primary
          />

          <AccountCard
            icon={<UserPlus size={22} />}
            label="Novo cliente"
            title="Criar conta"
            text="Cria uma conta TERR4 para guardar o histórico e receber novidades."
            href="/account/register"
          />
        </div>
      </section>
    </main>
  );
}

function AccountCard({
  icon,
  label,
  title,
  text,
  href,
  primary = false,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  text: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-[2rem] border p-8 transition duration-300 hover:-translate-y-1 ${
        primary
          ? "border-white/15 bg-[#f4efe4] text-neutral-950"
          : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07]"
      }`}
    >
      <div
        className={`flex size-12 items-center justify-center rounded-full ${
          primary ? "bg-neutral-950 text-white" : "bg-white/[0.06] text-[#e8e0d4]"
        }`}
      >
        {icon}
      </div>

      <p
        className={`mt-8 text-xs font-black uppercase tracking-[0.28em] ${
          primary ? "text-neutral-950/45" : "text-white/35"
        }`}
      >
        {label}
      </p>

      <div className="mt-4 flex items-end justify-between gap-6">
        <h2 className="text-4xl font-black tracking-[-0.04em]">
          {title}
        </h2>

        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition ${
            primary
              ? "border-neutral-950/15 group-hover:bg-neutral-950 group-hover:text-white"
              : "border-white/10 text-white/45 group-hover:border-white/25 group-hover:text-white"
          }`}
        >
          <ArrowUpRight size={16} />
        </span>
      </div>

      <p
        className={`mt-5 max-w-md text-sm leading-7 ${
          primary ? "text-neutral-950/60" : "text-[#c8c4be]/55"
        }`}
      >
        {text}
      </p>
    </Link>
  );
}
function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-4 text-4xl font-black">{value}</p>
    </div>
  );
}