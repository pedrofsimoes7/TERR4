import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          Conta
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight">
          Verifica o teu email
        </h1>

        <p className="mt-4 text-sm leading-6 text-white/55">
          Enviámos um link de confirmação para o teu email. Abre o email e confirma a conta antes de fazer login.
        </p>

        <Link
          href="/account/login"
          className="mt-8 flex h-13 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950 transition hover:bg-stone-200"
        >
          Ir para login
        </Link>
      </div>
    </main>
  );
}