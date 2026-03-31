import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth/jwt";
import { COOKIE_NAME } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return deny(request);
  }
  try {
    await verifyToken(token);
  } catch {
    return deny(request);
  }
  return NextResponse.next();
}

function deny(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const login = new URL("/login", request.url);
  login.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/api/projects",
    "/api/projects/:path*",
    "/api/tasks",
    "/api/tasks/:path*",
  ],
};
