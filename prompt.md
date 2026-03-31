In this `TeamFlow` workshop app, implement a small, reviewable feature:
1. add an optional `dueDate` field to `Task`
2. let a project’s owner be selected from existing `User` records when creating a project

Project context:
- Stack is Next.js 14 App Router, TypeScript, Tailwind, Prisma, SQLite.
- Current schema: `Project` already belongs to a user via `userId`; `Task` currently has no due date.
- Main files likely involved: `prisma/schema.prisma`, `app/api/projects/route.ts`, `app/api/tasks/route.ts`, `app/api/tasks/[id]/route.ts`, `components/DashboardClient.tsx`.
- This repo intentionally leaves some gaps for workshop use. Do not broaden scope into general validation/loading/error-boundary refactors unless required for this feature.

Requirements:
- Reuse the existing `Project.userId` relation as the owner field. Do not introduce a second owner relation unless truly necessary.
- Add a new Prisma migration. Never modify old migrations.
- `dueDate` should be optional and stored as `DateTime?` in Prisma.
- Project creation UI should offer a select populated from existing users, not free text.
- Task creation UI should allow setting a due date, and task display should show it when present.
- API routes should accept and return the new fields needed by the UI.
- Keep auth/ownership behavior consistent with the current app unless a conflict makes that impossible. If there is a product ambiguity, stop and ask instead of guessing.
- Keep diffs minimal and aligned with existing code style and architecture.

Before editing:
- Briefly inspect the current schema and routes.
- Propose a short plan listing the files you expect to change and the exact model/API/UI decisions.
- Wait for confirmation before making changes.

Acceptance criteria:
- A user can create a project and choose an owner from existing users.
- A user can create a task with or without a due date.
- Dashboard data loads and renders without breaking current task/project flows.
- `npm run build` passes.
- Run `npm run lint` if applicable for touched files.
- Summarize exactly what changed, why, and any API shape differences.