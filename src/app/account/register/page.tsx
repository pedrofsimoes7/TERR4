import Link from "next/link";
import { customerRegisterAction } from "./actions";

export default function CustomerRegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          Conta
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight">
          Criar conta
        </h1>

        <p className="mt-4 text-sm leading-6 text-white/55">
          Guarda encomendas, acompanha novidades e acede ao universo TERR4.
        </p>

        <form
          action={customerRegisterAction}
          className="mt-8 space-y-5"
        >
          <input
            type="text"
            name="name"
            placeholder="Nome"
            className="h-13 w-full rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/35"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="h-13 w-full rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/35"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="h-13 w-full rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/35"
          />

          <button
            type="submit"
            className="flex h-13 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950 transition hover:bg-stone-200"
          >
            Criar conta
          </button>
        </form>

        <p className="mt-6 text-sm text-white/45">
          Já tens conta?{" "}
          <Link
            href="/account/login"
            className="font-bold text-white"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}