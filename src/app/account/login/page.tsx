// ===== account/login/page.tsx =====
import Link from "next/link";
import { accountLoginAction } from "./actions";

export default function CustomerLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070706] px-6 text-white">
      <div className="w-full max-w-md">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
          Conta
        </p>
        <h1 className="mt-4 text-5xl font-black leading-[0.9] tracking-[-0.04em]">
          Entrar.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#c8c4be]/55">
          Acede à tua conta TERR4.
        </p>

        <form action={accountLoginAction} className="mt-10 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="h-13 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-white outline-none placeholder:text-white/30 transition-colors focus:border-[#c46a2d]/60 focus:bg-white/[0.07]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="h-13 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-white outline-none placeholder:text-white/30 transition-colors focus:border-[#c46a2d]/60 focus:bg-white/[0.07]"
          />
          <button
            type="submit"
            className="btn-wipe mt-2 flex h-13 w-full items-center justify-center rounded-full bg-[#f4efe4] text-sm font-black uppercase tracking-[0.1em] text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white active:scale-[0.97]"
          >
            Entrar
          </button>
        </form>

        <p className="mt-7 text-sm text-[#c8c4be]/45">
          Ainda não tens conta?{" "}
          <Link href="/account/register" className="font-black text-white underline-offset-4 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}