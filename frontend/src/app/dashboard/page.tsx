"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ListTodo,
  LogOut,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext";

import {
  assignTaskToSelf,
  deleteTask,
  getTasks,
} from "../../services/task.service";

import { Task } from "../../types/task";

import CreateTaskModal from "../../components/dashboard/CreateTaskModal";
import EditTaskModal from "../../components/dashboard/EditTaskModal";
import TaskBoard from "../../components/dashboard/TaskBoard";

export default function DashboardPage() {
  // ============================================================
  // ROUTER + AUTH
  // ============================================================

  const router = useRouter();

  const {
    user,
    logout,
    loading: authLoading,
  } = useAuth();

  // ============================================================
  // STATE
  // ============================================================

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] =
    useState(true);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  // ============================================================
  // REDIRECT IF USER IS NOT LOGGED IN
  // ============================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // ============================================================
  // LOAD TASKS
  // ============================================================

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const loadTasks = async () => {
      try {
        setTasksLoading(true);

        const taskData = await getTasks();

        setTasks(taskData);
      } catch (error: unknown) {
        console.error(
          "Failed to load tasks:",
          error
        );

        const axiosError = error as {
          response?: {
            status?: number;
            data?: {
              message?: string;
            };
          };
        };

        if (
          axiosError.response?.status === 401
        ) {
          logout();
          router.push("/login");
          return;
        }

        toast.error(
          axiosError.response?.data?.message ||
            "Failed to load tasks"
        );
      } finally {
        setTasksLoading(false);
      }
    };

    loadTasks();
  }, [
    authLoading,
    user,
    logout,
    router,
  ]);

  // ============================================================
  // CREATE TASK
  // ============================================================

  const handleTaskCreated = (
    newTask: Task
  ) => {
    setTasks((currentTasks) => [
      newTask,
      ...currentTasks,
    ]);

    setShowCreateModal(false);
  };

  // ============================================================
  // UPDATE TASK
  // ============================================================

  const handleTaskUpdated = (
    updatedTask: Task
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );

    setEditingTask(null);
  };

  // ============================================================
  // DELETE TASK
  // ============================================================

  const handleDeleteTask = async (
    task: Task
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(task.id);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (currentTask) =>
            currentTask.id !== task.id
        )
      );

      toast.success(
        "Task deleted successfully"
      );
    } catch (error: unknown) {
      console.error(
        "Delete task error:",
        error
      );

      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      toast.error(
        axiosError.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  // ============================================================
  // ASSIGN TASK TO SELF
  // ============================================================

  const handleAssignToSelf = async (
    task: Task
  ) => {
    try {
      const updatedTask =
        await assignTaskToSelf(task.id);

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id
            ? updatedTask
            : currentTask
        )
      );

      toast.success(
        "Task assigned to you successfully"
      );
    } catch (error: unknown) {
      console.error(
        "Assign task error:",
        error
      );

      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      toast.error(
        axiosError.response?.data?.message ||
          "Failed to assign task"
      );
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalTasks = tasks.length;

  const doingTasks = tasks.filter(
    (task) => task.status === "DOING"
  ).length;

  const doneTasks = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  // ============================================================
  // AUTH LOADING
  // ============================================================

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  // ============================================================
  // NOT AUTHENTICATED
  // ============================================================

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Redirecting to login...
        </p>
      </main>
    );
  }

  // ============================================================
  // MAIN DASHBOARD
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ======================================================
          NAVBAR
      ======================================================= */}

      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
              ✓
            </div>

            <span className="text-xl font-bold text-slate-900">
              TaskFlow
            </span>
          </div>

          {/* User */}

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user.name}
              </p>

              <p className="text-xs uppercase tracking-wide text-slate-500">
                {user.role}
              </p>
            </div>

            {/* Avatar */}

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
              {user.name
                .charAt(0)
                .toUpperCase()}
            </div>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* ====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Hello,{" "}
              {user.name.split(" ")[0]} 
            </h1>

            <p className="mt-2 text-slate-500">
              Here's an overview of your tasks
              and progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreateModal(true)
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus size={18} />

            Create Task
          </button>
        </div>

        {/* ====================================================
            STATISTICS
        ===================================================== */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {/* Total */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Tasks
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalTasks}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  All your tasks
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <ListTodo size={22} />
              </div>
            </div>
          </div>

          {/* Doing */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {doingTasks}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Tasks you are working on
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock3 size={22} />
              </div>
            </div>
          </div>

          {/* Done */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {doneTasks}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Finished tasks
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            TASK BOARD
        ===================================================== */}

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              My Task Board
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Drag tasks between columns to
              update their progress.
            </p>
          </div>

          {/* Loading */}

          {tasksLoading ? (
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="h-[450px] animate-pulse rounded-xl bg-slate-200" />

              <div className="h-[450px] animate-pulse rounded-xl bg-slate-200" />

              <div className="h-[450px] animate-pulse rounded-xl bg-slate-200" />
            </div>
          ) : (
            <TaskBoard
              tasks={tasks}
              currentUserId={user.id}
              onTasksUpdated={setTasks}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onAssignToSelf={
                handleAssignToSelf
              }
            />
          )}
        </section>
      </div>

      {/* ======================================================
          CREATE TASK MODAL
      ======================================================= */}

      {showCreateModal && (
        <CreateTaskModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onTaskCreated={
            handleTaskCreated
          }
        />
      )}

      {/* ======================================================
          EDIT TASK MODAL
      ======================================================= */}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() =>
            setEditingTask(null)
          }
          onTaskUpdated={
            handleTaskUpdated
          }
        />
      )}
    </main>
  );
}