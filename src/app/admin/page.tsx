import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "./actions";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, customerCount, rentalCount, pendingRentals, products] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.customerUser.count(),
      prisma.rental.count(),
      prisma.rental.count({ where: { status: "PENDING" } }),
      prisma.product.findMany({
        include: { images: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">Dashboard</p>
            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">TERR4 Admin</h1>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold text-white/70 transition hover:bg-white hover:text-neutral-950"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          <Stat label="Produtos" value={productCount.toString()} />
          <Stat label="Encomendas" value={orderCount.toString()} />
          <Stat label="Clientes" value={customerCount.toString()} />
          <Stat label="Alugueres" value={rentalCount.toString()} badge={pendingRentals > 0 ? `${pendingRentals} pendente${pendingRentals === 1 ? "" : "s"}` : undefined} />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <AdminLink href="/admin/products" title="Produtos" text="Gerir catálogo, preços e stock" />
          <AdminLink href="/admin/orders" title="Encomendas" text="Ver e aprovar pedidos" />
          <AdminLink href="/admin/rentals" title="Alugueres" text="Calendário e reservas" badge={pendingRentals > 0 ? pendingRentals : undefined} />
          <AdminLink href="/admin/customers" title="Clientes" text="Histórico e contactos" />
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-2xl font-black">Produtos recentes</h2>
          </div>

          <div className="divide-y divide-white/10">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-6 px-6 py-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">{product.category}</p>
                  <h3 className="mt-2 text-xl font-black">{product.name}</h3>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {product.priceCents ? `€${product.priceCents / 100}` : "Sem preço"}
                  </p>
                  <p className="mt-1 text-sm text-white/45">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/45">{label}</p>
        {badge && (
          <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-amber-300">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-4 text-4xl font-black">{value}</p>
    </div>
  );
}

function AdminLink({ href, title, text, badge }: { href: string; title: string; text: string; badge?: number }) {
  return (
    <Link
      href={href}
      className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.08]"
    >
      {badge !== undefined && badge > 0 && (
        <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-neutral-950">
          {badge}
        </span>
      )}
      <h3 className="font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
    </Link>
  );
}