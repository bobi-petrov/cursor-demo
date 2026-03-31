# TeamFlow — agent / contributor guide

## What this project is

**TeamFlow** is a small full-stack task manager: users sign in, create **projects**, add **tasks** under each project, mark tasks complete, and delete projects or tasks. A **dashboard** lists the signed-in user’s projects with per-project task counts and inline actions.

## Stack

- **Next.js 14** (App Router), **React**, **TypeScript** (strict)
- **Tailwind CSS**
- **Prisma** + **SQLite** (`DATABASE_URL`, see `.env.example`)
- **JWT** auth (`jose`, HS256) in an **httpOnly** cookie (`teamflow_token`)
- **Jest** for tests (currently focused on auth helpers)

Auth and cookies are oriented toward local development, not a full production threat model.

## Data model (`prisma/schema.prisma`)

- **User** — email (unique), password hash; owns many **Project** rows.
- **Project** — name, `userId` → **User**; has many **Task** rows.
- **Task** — title, `completed`, `projectId` → **Project**.

IDs are Prisma **cuid** strings.

## Repository layout

| Path | Role |
|------|------|
| `app/` | App Router: `page.tsx` routes, `layout.tsx`, **`app/api/**/route.ts`** HTTP handlers |
| `app/api/auth/` | `register`, `login`, `logout` |
| `app/api/projects/` | `GET`/`POST` projects; `app/api/projects/[id]/route.ts` delete |
| `app/api/tasks/` | `GET`/`POST` tasks (optional `?projectId=`); `app/api/tasks/[id]/route.ts` patch complete / delete |
| `components/` | Client UI (e.g. `DashboardClient.tsx` — dashboard data + forms) |
| `lib/prisma.ts` | Shared Prisma client |
| `lib/auth/` | `jwt.ts`, `session.ts` (cookie/session), `password.ts` |
| `middleware.ts` | Request filtering (e.g. protected paths) |
| `prisma/` | `schema.prisma` and migrations |

## Behavioral notes

- Projects and tasks returned from the API are scoped to the **current user** (via JWT `sub` and `Project.userId` / nested relations).
- The dashboard loads projects and tasks via **separate client** `fetch` calls to `/api/projects` and `/api/tasks`.

## Working on the codebase

- Prefer **small, localized changes**; match existing style and patterns in the files you touch.
- For **schema changes**: add a **new** Prisma migration; do not edit historical migration SQL.
- After substantive changes: **`npm run build`** should pass; run **`npm run lint`** when you change files the repo lints.
- When adding or changing runtime behavior, extend **Jest** tests if the area already has tests or the change is easy to cover; otherwise note test gaps in the PR/summary.

## Summary for reviewers

When you open a PR or finish a task, briefly state **what** changed, **why**, and any **API or DB** surface changes.
