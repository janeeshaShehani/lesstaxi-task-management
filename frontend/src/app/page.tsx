import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  GripVertical,
  LayoutDashboard,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-slate-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              ✓
            </span>
            TaskFlow
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600">
              <CheckCircle2 size={16} />
              Simple task management
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-slate-900 lg:text-6xl">
              Organize your work.
              <span className="block text-indigo-600">
                Track your progress.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              TaskFlow helps individuals and teams organize tasks,
              track progress, and manage work efficiently with a
              simple Kanban board.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/login"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Board Preview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">
                  My Task Board
                </p>

                <p className="text-sm text-slate-500">
                  Manage your work
                </p>
              </div>

              <LayoutDashboard
                size={22}
                className="text-indigo-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* TODO */}
              <div className="rounded-xl bg-slate-100 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    TO DO
                  </span>

                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                    3
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-sm font-medium text-slate-900">
                      Design login page
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Create responsive UI
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-sm font-medium text-slate-900">
                      Database schema
                    </p>
                  </div>
                </div>
              </div>

              {/* DOING */}
              <div className="rounded-xl bg-slate-100 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    DOING
                  </span>

                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-600">
                    2
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">
                        Build API
                      </p>

                      <GripVertical
                        size={15}
                        className="text-slate-300"
                      />
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Task CRUD endpoints
                    </p>
                  </div>
                </div>
              </div>

              {/* DONE */}
              <div className="rounded-xl bg-slate-100 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    DONE
                  </span>

                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                    4
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-sm font-medium text-slate-900">
                      Project setup
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 size={14} />
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}