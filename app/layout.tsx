import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "TeamFlow",
  description: "Workshop demo task management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="text-lg font-semibold text-slate-900">
              TeamFlow
            </Link>
            <nav className="flex gap-4 text-sm text-slate-600">
              <Link href="/login" className="hover:text-slate-900">
                Login
              </Link>
              <Link href="/register" className="hover:text-slate-900">
                Register
              </Link>
              <Link href="/dashboard" className="hover:text-slate-900">
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
