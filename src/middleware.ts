import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_NAME = "terr4-admin-session";

const secret = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || "dev-secret-change-this"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A página de login é a única rota /admin aberta.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protege todo o resto de /admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};