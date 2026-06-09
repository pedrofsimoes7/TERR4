import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const adminSession = request.cookies.get("terr4-admin-session");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAdminLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isAdminLoginPage && !adminSession) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  if (isAdminLoginPage && adminSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};