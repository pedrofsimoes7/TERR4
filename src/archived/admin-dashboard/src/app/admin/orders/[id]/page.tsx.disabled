import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatusAction } from "../actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!order) notFound();

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-5xl">
        <Link
          href="/admin/orders"
          className="text-sm font-bold text-white/55 hover:text-white"
        >
          ← Voltar às encomendas
        </Link>

        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Encomenda #{order.id.slice(0, 8)}
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              {order.customerName}
            </h1>
          </div>

          <form action={updateOrderStatusAction}>
            <input type="hidden" name="id" value={order.id} />

            <select
              name="status"
              defaultValue={order.status}
              className="h-12 rounded-full border border-white/10 bg-neutral-900 px-4 text-xs font-bold uppercase tracking-[0.12em] text-white outline-none"
            >
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="ml-2 rounded-full bg-white px-5 py-3 text-xs font-black text-neutral-950 hover:bg-stone-200"
            >
              Guardar
            </button>
          </form>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Stat label="Estado" value={order.status} />
          <Stat label="Total" value={formatPrice(order.totalCents / 100)} />
          <Stat
            label="Data"
            value={order.createdAt.toLocaleDateString("pt-PT")}
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
            <h2 className="text-2xl font-black">Produtos</h2>

            <div className="mt-6 grid gap-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-4"
                >
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="mt-1 text-sm text-white/45">
                      Quantidade: {item.quantity} · Unitário:{" "}
                      {formatPrice(item.unitCents / 100)}
                    </p>
                  </div>

                  <p className="font-black">
                    {formatPrice((item.unitCents * item.quantity) / 100)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Panel title="Cliente">
              <p className="font-bold">{order.customerName}</p>
              <p className="mt-2 text-sm text-white/55">
                {order.customerEmail}
              </p>
              {order.customerPhone && (
                <p className="mt-1 text-sm text-white/55">
                  {order.customerPhone}
                </p>
              )}
            </Panel>

            <Panel title="Entrega">
              <p className="text-sm leading-7 text-white/55">
                {[order.address, order.postalCode, order.city, order.country]
                  .filter(Boolean)
                  .join(", ") || "Sem morada"}
              </p>
            </Panel>

            {order.notes && (
              <Panel title="Notas">
                <p className="text-sm leading-7 text-white/55">
                  {order.notes}
                </p>
              </Panel>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">
        {label}
      </p>
      <p className="mt-3 text-xl font-black">{value}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}