import { NextResponse } from "next/server";

import { signToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";
import { COOKIE_NAME, cookieOptions } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = body.email as string | undefined;
  const password = body.password as string | undefined;

  const existing = await prisma.user.findUnique({
    where: { email: email ?? "" },
  });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password ?? "");
  const user = await prisma.user.create({
    data: {
      email: email ?? "",
      passwordHash,
    },
  });

  const token = await signToken({ sub: user.id, email: user.email });
  const res = NextResponse.json({
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
  });
  res.cookies.set(COOKIE_NAME, token, cookieOptions);
  return res;
}
