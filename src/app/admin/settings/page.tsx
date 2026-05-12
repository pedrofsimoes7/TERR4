import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
              Admin
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Definições
            </h1>
          </div>

          <Link
            href="/admin"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold text-white/70 hover:bg-white hover:text-neutral-950"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
          <div className="grid gap-6">
            <Input
              label="Nome da marca"
              defaultValue="TERR4"
            />

            <Input
              label="Email"
              defaultValue="hello@terr4.pt"
            />

            <Input
              label="Telefone"
              defaultValue="+351 912 345 678"
            />

            <button
              type="button"
              className="mt-4 flex h-13 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950 transition hover:bg-stone-200"
            >
              Guardar alterações
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Input({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-white/70">
        {label}
      </label>

      <input
        defaultValue={defaultValue}
        className="mt-2 h-13 w-full rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none"
      />
    </div>
  );
}