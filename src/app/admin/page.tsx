import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const productCount = await prisma.product.count();

  const products = await prisma.product.findMany({
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          Dashboard
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
          TERR4 Admin
        </h1>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Stat label="Produtos" value={productCount.toString()} />
          <Stat label="Encomendas" value="0" />
          <Stat label="Clientes" value="0" />
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-2xl font-black">
              Produtos
            </h2>
          </div>

          <div className="divide-y divide-white/10">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-6 px-6 py-5"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    {product.category}
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    {product.name}
                  </h3>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    {product.priceCents
                      ? `€${product.priceCents / 100}`
                      : "Sem preço"}
                  </p>

                  <p className="mt-1 text-sm text-white/45">
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
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
      <p className="text-sm text-white/45">
        {label}
      </p>

      <p className="mt-4 text-4xl font-black">
        {value}
      </p>
    </div>
  );
}