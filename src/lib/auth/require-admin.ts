import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

/**
 * Garante que quem chama é admin com sessão válida.
 * Usar como PRIMEIRA linha de páginas e Server Actions de admin.
 */
export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}