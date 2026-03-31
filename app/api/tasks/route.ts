import { NextResponse } from "next/server";

import { getSessionFromCookies } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") ?? undefined;

  const where = {
    project: { userId: session.sub },
    ...(projectId ? { projectId } : {}),
  };

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      completed: true,
      projectId: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const title = body.title as string | undefined;
  const projectId = body.projectId as string | undefined;

  const project = await prisma.project.findFirst({
    where: { id: projectId ?? "", userId: session.sub },
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const task = await prisma.task.create({
    data: {
      title: title ?? "",
      projectId: project.id,
    },
    select: {
      id: true,
      title: true,
      completed: true,
      projectId: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ task });
}
