import Link from "next/link";
import { createProductAction } from "./actions";
import { NewProductForm } from "./new-product-form";

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-4xl">
        <Link href="/admin/products" className="text-sm font-bold text-white/55 hover:text-white">
          ← Voltar aos produtos
        </Link>

        <p className="mt-10 text-xs font-bold uppercase tracking-[0.35em] text-stone-400">Admin</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight">Novo produto.</h1>

        <NewProductForm createAction={createProductAction} />
      </section>
    </main>
  );
}