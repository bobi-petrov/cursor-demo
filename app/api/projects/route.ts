import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true },
  });
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const name = body.name as string | undefined;

  const project = await prisma.project.create({
    data: {
      name: name ?? "",
      userId: session.sub,
    },
    select: { id: true, name: true, createdAt: true },
  });
  return NextResponse.json({ project });
}
