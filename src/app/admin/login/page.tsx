import { Shield } from "lucide-react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-white text-neutral-950">
          <Shield size={28} />
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          Admin
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight">
          TERR4 Dashboard
        </h1>

        <p className="mt-4 text-sm leading-6 text-white/55">
          Área privada de gestão da TERR4.
        </p>

        <form action={loginAction} className="mt-8 space-y-5">
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
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}