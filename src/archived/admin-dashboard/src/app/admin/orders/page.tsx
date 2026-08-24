import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatusAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Admin
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Encomendas
            </h1>
          </div>

          <Link
            href="/admin"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold text-white/70 hover:bg-white hover:text-neutral-950"
          >
            Dashboard
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">
            <h2 className="text-2xl font-black">Sem encomendas ainda</h2>
            <p className="mt-4 text-white/45">
              Quando existirem pedidos no checkout, vão aparecer aqui.
            </p>
          </div>
        ) : (
          <div className="mt-12 space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">
                      #{order.id.slice(0, 8)}
                    </p>

                    <h2 className="mt-3 text-2xl font-black">
                      {order.customerName}
                    </h2>

                    <p className="mt-2 text-sm text-white/50">
                      {order.customerEmail}
                    </p>

                    {order.customerPhone && (
                      <p className="mt-1 text-sm text-white/50">
                        {order.customerPhone}
                      </p>
                    )}
                  </div>

                  <div className="text-left md:text-right">
                    <form action={updateOrderStatusAction}>
                      <input type="hidden" name="id" value={order.id} />

                      <select
                        name="status"
                        defaultValue={order.status}
                        className="h-10 rounded-full border border-white/10 bg-neutral-900 px-4 text-xs font-bold uppercase tracking-[0.12em] text-white outline-none"
                      >
                        {Object.values(OrderStatus).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        type="submit"
                        className="ml-2 rounded-full bg-white px-4 py-2 text-xs font-black text-neutral-950 hover:bg-stone-200"
                      >
                        Guardar
                      </button>
                    </form>

                    <p className="mt-4 text-2xl font-black">
                      {formatPrice(order.totalCents / 100)}
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      {order.createdAt.toLocaleDateString("pt-PT")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">
                      Produtos
                    </p>

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/70 hover:bg-white hover:text-neutral-950"
                    >
                      Ver detalhes
                    </Link>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3"
                      >
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="mt-1 text-sm text-white/45">
                            Quantidade: {item.quantity}
                          </p>
                        </div>

                        <p className="font-bold">
                          {formatPrice((item.unitCents * item.quantity) / 100)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}