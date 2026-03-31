import { NextResponse } from "next/server";

import { signToken } from "@/lib/auth/jwt";
import { verifyPassword } from "@/lib/auth/password";
import { COOKIE_NAME, cookieOptions } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = body.email as string | undefined;
  const password = body.password as string | undefined;

  const user = await prisma.user.findUnique({
    where: { email: email ?? "" },
  });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password ?? "", user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({ sub: user.id, email: user.email });
  const res = NextResponse.json({
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
  });
  res.cookies.set(COOKIE_NAME, token, cookieOptions);
  return res;
}
