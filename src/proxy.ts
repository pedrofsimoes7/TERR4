import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// A gestão está temporariamente suspensa. O código encontra-se arquivado em
// src/archived/admin-dashboard para poder ser reposto mais tarde.
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
