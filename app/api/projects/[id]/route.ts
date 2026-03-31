import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } };

export async function DELETE(_request: Request, context: Ctx) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = context.params;
  const project = await prisma.project.findFirst({
    where: { id, userId: session.sub },
  });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
