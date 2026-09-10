"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ListTodo,
  LogOut,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext";

import {
  assignTask,
  getTasks,
} from "../../services/task.service";

import { getUsers } from "../../services/user.service";

import { Task } from "../../types/task";
import { User } from "../../types/user";

import TaskBoard from "../../components/dashboard/TaskBoard";

export default function AdminPage() {
  const router = useRouter();

  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // Check admin access
  // --------------------------------------------------
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // --------------------------------------------------
  // Load tasks and users
  // --------------------------------------------------
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);

       







const taskResult = await getTasks();

console.log("TASK RESULT:", taskResult);
console.log(
  "IS ARRAY:",
  Array.isArray(taskResult)
);

setTasks(
  Array.isArray(taskResult)
    ? taskResult
    : []
);







        const userResult = await getUsers();        
        setUsers(userResult);

      } catch (error) {
        console.error(
          "Failed to load admin data:",
          error
        );

        toast.error(
          "Failed to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "ADMIN") {
      loadAdminData();
    }
  }, [user]);

  // --------------------------------------------------
  // Admin assignment
  // --------------------------------------------------
  const handleAssign = async (
    taskId: string,
    userId: string | null
  ) => {
    try {
      const updatedTask = await assignTask(
        taskId,
        userId
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? updatedTask
            : task
        )
      );

      toast.success(
        userId
          ? "Task assigned successfully"
          : "Task unassigned"
      );
    } catch (error) {
      console.error(
        "Failed to assign task:",
        error
      );

      toast.error("Failed to assign task");
    }
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // --------------------------------------------------
  // Prevent rendering for non-admin
  // --------------------------------------------------
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------
  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const doingTasks = tasks.filter(
    (task) => task.status === "DOING"
  ).length;

  const doneTasks = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ============================================
          HEADER
      ============================================ */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                ✓
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  TaskFlow
                </h1>

                <p className="text-xs text-slate-500">
                  Administration
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                {user.name}
              </p>

              <p className="text-xs text-indigo-600">
                Administrator
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================
          CONTENT
      ============================================ */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Users
              size={28}
              className="text-indigo-600"
            />

            <h2 className="text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h2>
          </div>

          <p className="mt-2 text-slate-500">
            Manage users, tasks, and assignments
            across the system.
          </p>
        </div>

        {/* ==========================================
            STATISTICS
        ========================================== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Users */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Users
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {users.length}
                </p>
              </div>

              <div className="rounded-lg bg-indigo-50 p-3">
                <Users
                  size={24}
                  className="text-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Tasks
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {totalTasks}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-3">
                <ListTodo
                  size={24}
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  In Progress
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {doingTasks}
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 p-3">
                <Clock3
                  size={24}
                  className="text-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {doneTasks}
                </p>
              </div>

              <div className="rounded-lg bg-emerald-50 p-3">
                <CheckCircle2
                  size={24}
                  className="text-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            USERS
        ========================================== */}
        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-semibold text-slate-900">
              System Users
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              View all registered users and their
              roles.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((userItem) => (
                  <tr
                    key={userItem.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                          {userItem.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="text-sm font-medium text-slate-900">
                          {userItem.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {userItem.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          userItem.role === "ADMIN"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {userItem.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ==========================================
            ALL TASKS
        ========================================== */}
        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-semibold text-slate-900">
              All Tasks
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Drag tasks between columns and assign
              them to users.
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="py-12 text-center text-sm text-slate-500">
                Loading tasks...
              </div>
            ) : (
              <TaskBoard
                tasks={tasks}
                currentUserId={user.id}
                onTasksUpdated={setTasks}
                isAdmin={true}
                users={users}
                onAssign={handleAssign}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}