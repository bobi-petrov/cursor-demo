In this `TeamFlow` app, implement the following feature additions:

1. Add an optional `dueDate` field to `Task`
2. Add a `priority` field to `Task` (enum: `low`, `medium`, `high`; default `medium`)
3. Let a project's owner be selected from existing `User` records when creating a project
4. Add filtering by priority and sorting by due date / priority to the dashboard task list

Project context:
- Stack is Next.js 14 App Router, TypeScript, Tailwind, Prisma, SQLite.
- Current schema: `Project` already belongs to a user via `userId`; `Task` has `id`, `title`, `completed`, `projectId`, `createdAt` — no due date or priority yet.
- Main files likely involved: `prisma/schema.prisma`, `app/api/projects/route.ts`, `app/api/tasks/route.ts`, `app/api/tasks/[id]/route.ts`, `components/DashboardClient.tsx`.
- Do not broaden scope into general validation/loading/error-boundary refactors unless required for this feature.

Schema requirements:
- Add a **new** Prisma migration. Never modify old migrations.
- `dueDate` → optional `DateTime?` on `Task`.
- `priority` → Prisma enum `Priority { low medium high }`, default `medium`. SQLite does not have a native enum type; Prisma maps this as a string — ensure the migration reflects that correctly.
- Reuse the existing `Project.userId` relation as the owner field. Do not introduce a second owner relation.

API requirements:
- `POST /api/tasks`: accept `dueDate` (ISO string or null) and `priority` in the request body; store them on create.
- `GET /api/tasks`: return `dueDate` and `priority` in each task object. Accept optional query params `?priority=low|medium|high` for server-side filtering and `?sort=dueDate|priority` for server-side ordering.
- `PATCH /api/tasks/[id]`: allow updating `dueDate` and `priority` alongside the existing `completed` field.
- `GET /api/projects`: needs to return enough user data for the owner select — add a `GET /api/users` route (or extend projects) to list existing users (id + email only, no password hashes).
- `POST /api/projects`: no change to how `userId` is stored; the UI change is client-side only.
- Keep `401` / `404` semantics as today. Keep auth/ownership scoping unchanged.

UI requirements (`components/DashboardClient.tsx`):
- Task creation form: add a `<input type="date">` for due date (optional) and a `<select>` for priority (low / medium / high, default medium).
- Project creation form: add a `<select>` populated from `/api/users` (email as label, id as value) so the creator can choose an existing user as owner. Keep existing `userId` wiring — just drive it from the select instead of the session implicitly.
- Dashboard task list: add client-side controls to filter by priority and sort by due date (asc/none) and priority (high→low). Overdue tasks (dueDate in the past and not completed) should have a distinct visual indicator (e.g. red text on the date).
- Match existing Tailwind class patterns and component style in the file. No new UI libraries.

Before editing:
- Briefly inspect the current schema, routes, and `DashboardClient.tsx`.
- Propose a short plan listing every file you expect to change, the exact enum/migration strategy for SQLite, and API shape decisions.
- Wait for confirmation before making changes.

Acceptance criteria:
- A user can create a project and choose an owner from existing users.
- A user can create a task with optional due date and required priority.
- Dashboard allows filtering by priority and sorting by due date / priority; overdue incomplete tasks are visually marked.
- `npm run build` passes and TypeScript is clean.
- Run `npm run lint` for touched files.
- Summarize exactly what changed, why, and any API or DB surface differences.
