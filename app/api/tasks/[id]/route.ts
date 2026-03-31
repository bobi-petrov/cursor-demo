import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } };

export async function PATCH(request: Request, context: Ctx) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = context.params;
  const task = await prisma.task.findFirst({
    where: { id, project: { userId: session.sub } },
  });
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const completed = body.completed as boolean | undefined;

  const updated = await prisma.task.update({
    where: { id },
    data: {
      ...(typeof completed === "boolean" ? { completed } : {}),
    },
    select: {
      id: true,
      title: true,
      completed: true,
      projectId: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ task: updated });
}

export async function DELETE(_request: Request, context: Ctx) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = context.params;
  const task = await prisma.task.findFirst({
    where: { id, project: { userId: session.sub } },
  });
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
