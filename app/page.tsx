import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        TeamFlow
      </h1>
      <p className="mt-3 text-lg text-slate-600">
        A small task management demo for workshops: projects, tasks, and a
        simple dashboard.
      </p>
      <ul className="mt-8 flex flex-wrap gap-3">
        <li>
          <Link
            href="/register"
            className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create account
          </Link>
        </li>
        <li>
          <Link
            href="/login"
            className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Sign in
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard"
            className="inline-flex rounded-md border border-transparent px-4 py-2 text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900"
          >
            Go to dashboard
          </Link>
        </li>
      </ul>
    </div>
  );
}
