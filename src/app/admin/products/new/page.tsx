import Link from "next/link";
import { ProductStatus } from "@prisma/client";
import { createProductAction } from "./actions";

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/admin/products"
          className="text-sm font-bold text-white/55 hover:text-white"
        >
          ← Voltar aos produtos
        </Link>

        <p className="mt-10 text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          Admin
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight">
          Novo produto.
        </h1>

        <form
          action={createProductAction}
          className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-7"
        >
          <div className="grid gap-6">
            <Input name="name" label="Nome" />
            <Input name="slug" label="Slug" placeholder="ex: terr4-awning" />
            <Input name="category" label="Categoria" />

            <div className="grid gap-6 md:grid-cols-3">
              <Input name="price" label="Preço (€)" type="number" />
              <Input name="stock" label="Stock" type="number" />

              <div>
                <label className="text-sm font-bold text-white/70">
                  Estado
                </label>
                <select
                  name="status"
                  defaultValue="DRAFT"
                  className="mt-2 h-13 w-full rounded-full border border-white/10 bg-neutral-900 px-5 text-white outline-none"
                >
                  {Object.values(ProductStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              name="imageUrl"
              label="Imagem principal"
              defaultValue="/images/hero-jeep.jpeg"
            />

            <Textarea name="shortDescription" label="Descrição curta" />
            <Textarea name="description" label="Descrição longa" rows={7} />

            <button
              type="submit"
              className="mt-4 flex h-13 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950 transition hover:bg-stone-200"
            >
              Criar produto
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function Input({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-white/70">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 h-13 w-full rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/30"
      />
    </div>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-white/70">{label}</label>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-white outline-none"
      />
    </div>
  );
}