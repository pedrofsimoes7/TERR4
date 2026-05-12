import { cookies } from "next/headers";

const SESSION_NAME = "terr4-admin-session";

export async function createSession() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_NAME,
    value: "authenticated",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();

  return cookieStore.get(SESSION_NAME)?.value === "authenticated";
}