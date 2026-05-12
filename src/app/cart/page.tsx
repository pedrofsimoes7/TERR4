import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  return (
    <main className="bg-neutral-950 px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          Carrinho
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
          A tua seleção.
        </h1>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white/10">
            <ShoppingBag size={28} />
          </div>

          <h2 className="mt-6 text-2xl font-black">Carrinho vazio</h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
            Ainda não adicionaste nenhum produto. Explora o equipamento TERR4 e
            escolhe o que faz sentido para a tua próxima aventura.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-neutral-950 transition hover:bg-stone-200"
          >
            Ver produtos
          </Link>
        </div>
      </section>
    </main>
  );
}