# TeamFlow

Small task-management demo for workshops: **projects**, **tasks**, JWT **authentication** (httpOnly cookie), and a **dashboard** with per-project task counts.

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **Prisma** with **SQLite**
- **JWT** auth (HS256 via `jose`, **not** production-hardened)
- **Jest** (limited tests on purpose)

## Features

1. **Auth** — register, login, logout; JWT stored in an httpOnly cookie (`teamflow_token`).
2. **Projects** — create, list, delete (scoped to the signed-in user).
3. **Tasks** — create (assigned to a project), mark complete, delete.
4. **Dashboard** — lists projects, task counts, and inline task actions.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and set `JWT_SECRET` (at least 16 characters for the app checks).
3. `npx prisma migrate dev` (or `npm run db:migrate`) to apply migrations and create the SQLite DB.
4. `npm run dev` — open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command            | Purpose              |
| ------------------ | -------------------- |
| `npm run dev`      | Development server   |
| `npm run build`    | Production build     |
| `npm run start`    | Start production     |
| `npm run lint`     | ESLint               |
| `npm test`         | Jest                 |
| `npm run db:migrate` | Prisma migrate dev |

## Intentional gaps (for participants)

These are **deliberately** missing or rough:

- **No input validation** on API routes (no Zod/manual checks).
- **No React error boundaries** on the frontend.
- **No loading states** on async UI (forms, dashboard fetches).
- **Tests** only cover **`lib/auth/jwt.ts`** helpers — no API, component, or DB tests.
- **Dashboard performance**: loads **projects** and **tasks** in **two sequential client fetches** instead of one optimized server query or aggregated endpoint.

Fixing the above is left as workshop work.

## Security note

This app is for teaching. JWT secrets, cookie flags, and threat model are **development-oriented**, not a blueprint for production auth.
