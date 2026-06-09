import Link from "next/link";
import { prisma } from "@/lib/prisma";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;

  let success = false;

  if (token) {
    const customer = await prisma.customerUser.findUnique({
      where: {
        emailVerificationToken: token,
      },
    });

    if (
      customer &&
      customer.emailVerificationExpiresAt &&
      customer.emailVerificationExpiresAt > new Date()
    ) {
      await prisma.customerUser.update({
        where: {
          id: customer.id,
        },
        data: {
          emailVerifiedAt: new Date(),
          emailVerificationToken: null,
          emailVerificationExpiresAt: null,
        },
      });

      await prisma.order.updateMany({
        where: {
          customerEmail: customer.email,
          customerUserId: null,
        },
        data: {
          customerUserId: customer.id,
        },
      });

      success = true;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-stone-400">
          Conta
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight">
          {success ? "Email confirmado" : "Link inválido"}
        </h1>

        <p className="mt-4 text-sm leading-6 text-white/55">
          {success
            ? "A tua conta foi ativada com sucesso. Já podes iniciar sessão."
            : "Este link é inválido ou expirou. Cria conta novamente ou pede um novo email de confirmação."}
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