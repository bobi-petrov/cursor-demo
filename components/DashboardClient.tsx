"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Project = {
  id: string;
  name: string;
  createdAt: string;
};

type Task = {
  id: string;
  title: string;
  completed: boolean;
  projectId: string;
  createdAt: string;
};

export function DashboardClient() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const projectNameRef = useRef<HTMLInputElement>(null);
  const taskTitleRef = useRef<HTMLInputElement>(null);
  const taskProjectRef = useRef<HTMLSelectElement>(null);

  const loadDashboard = useCallback(async () => {
    // Workshop: could be one API + Prisma `include` / `_count` instead of two sequential round-trips.
    const projectsRes = await fetch("/api/projects", { credentials: "include" });
    const projectsData = (await projectsRes.json()) as { projects?: Project[] };
    const tasksRes = await fetch("/api/tasks", { credentials: "include" });
    const tasksData = (await tasksRes.json()) as { tasks?: Task[] };
    setProjects(projectsData.projects ?? []);
    setTasks(tasksData.tasks ?? []);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const countsByProject = useMemo(() => {
    const map = new Map<string, { total: number; done: number }>();
    for (const p of projects) {
      map.set(p.id, { total: 0, done: 0 });
    }
    for (const t of tasks) {
      const cur = map.get(t.projectId) ?? { total: 0, done: 0 };
      cur.total += 1;
      if (t.completed) cur.done += 1;
      map.set(t.projectId, cur);
    }
    return map;
  }, [projects, tasks]);

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    const name = projectNameRef.current?.value ?? "";
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
      credentials: "include",
    });
    if (projectNameRef.current) projectNameRef.current.value = "";
    loadDashboard();
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const title = taskTitleRef.current?.value ?? "";
    const projectId = taskProjectRef.current?.value ?? "";
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, projectId }),
      credentials: "include",
    });
    if (taskTitleRef.current) taskTitleRef.current.value = "";
    loadDashboard();
  }

  async function removeProject(id: string) {
    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    loadDashboard();
  }

  async function toggleTask(id: string, completed: boolean) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
      credentials: "include",
    });
    loadDashboard();
  }

  async function removeTask(id: string) {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    loadDashboard();
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
    router.refresh();
  }

  const tasksByProject = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const p of projects) {
      map.set(p.id, []);
    }
    for (const t of tasks) {
      const list = map.get(t.projectId) ?? [];
      list.push(t);
      map.set(t.projectId, list);
    }
    return map;
  }, [projects, tasks]);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">
            Projects and tasks (counts from two sequential fetches).
          </p>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50"
        >
          Log out
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          New project
        </h2>
        <form onSubmit={addProject} className="mt-3 flex flex-wrap gap-2">
          <input
            ref={projectNameRef}
            name="name"
            placeholder="Project name"
            className="min-w-[200px] flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add project
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          New task
        </h2>
        <form onSubmit={addTask} className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <select
            ref={taskProjectRef}
            name="projectId"
            defaultValue=""
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            <option value="" disabled>
              Select project
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            ref={taskTitleRef}
            name="title"
            placeholder="Task title"
            className="min-w-[200px] flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add task
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Your projects
        </h2>
        {projects.length === 0 ? (
          <p className="text-slate-600">
            No projects yet. Add one above, or{" "}
            <Link href="/register" className="underline">
              register
            </Link>{" "}
            a new account.
          </p>
        ) : (
          <ul className="space-y-4">
            {projects.map((p) => {
              const counts = countsByProject.get(p.id) ?? { total: 0, done: 0 };
              const projectTasks = tasksByProject.get(p.id) ?? [];
              return (
                <li
                  key={p.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{p.name}</h3>
                      <p className="text-sm text-slate-600">
                        {counts.done}/{counts.total} tasks complete
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(p.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete project
                    </button>
                  </div>
                  <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    {projectTasks.length === 0 ? (
                      <li className="text-sm text-slate-500">No tasks yet.</li>
                    ) : (
                      projectTasks.map((t) => (
                        <li
                          key={t.id}
                          className="flex flex-wrap items-center justify-between gap-2 text-sm"
                        >
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={t.completed}
                              onChange={() => toggleTask(t.id, t.completed)}
                            />
                            <span
                              className={
                                t.completed ? "text-slate-500 line-through" : "text-slate-900"
                              }
                            >
                              {t.title}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeTask(t.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
