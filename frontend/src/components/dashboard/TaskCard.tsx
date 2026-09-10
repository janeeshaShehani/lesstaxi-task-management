"use client";

import { Pencil, Trash2, UserRound } from "lucide-react";
import { Task } from "../../types/task";
import { User } from "../../types/user";

interface TaskCardProps {
  task: Task;

  canEdit?: boolean;
  canDelete?: boolean;

  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onAssignToSelf?: (task: Task) => void;

  isAdmin?: boolean;
  users?: User[];

  onAssign?: (
    taskId: string,
    userId: string | null
  ) => void;
}

export default function TaskCard({
  task,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
  onAssignToSelf,
  isAdmin = false,
  users = [],
  onAssign,
}: TaskCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Top section */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Title */}
          <h3 className="break-words text-base font-semibold text-slate-900">
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="mt-1 break-words text-sm leading-5 text-slate-500">
              {task.description}
            </p>
          )}
        </div>

        {/* Edit / Delete buttons */}
        {(canEdit || canDelete) && (
          <div className="flex shrink-0 items-center gap-1">
            {canEdit && onEdit && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                title="Edit task"
              >
                <Pencil size={16} />
              </button>
            )}

            {canDelete && onDelete && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task);
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Creator */}
      <div className="mt-4 text-xs text-slate-500">
        Created by{" "}
        <span className="font-medium text-slate-700">
          {task.createdBy?.name || "Unknown"}
        </span>
      </div>

      {/* Admin assignment */}
      {isAdmin && onAssign && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-600">
            <UserRound size={14} />
            Assign task
          </label>

          <select
            value={task.assignedToId ?? ""}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();

              const userId = e.target.value || null;

              onAssign(task.id, userId);
            }}
            className="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Unassigned</option>

            {users
              .filter((user) => user.role === "USER")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Normal user - current assignee */}
      {!isAdmin && task.assignedTo && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <UserRound size={14} />

          <span>Assigned to</span>

          <span className="font-medium text-slate-700">
            {task.assignedTo.name}
          </span>
        </div>
      )}

      {/* Admin - current assignee */}
      {isAdmin && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <UserRound size={14} />

          <span>Current assignee:</span>

          <span className="font-medium text-slate-700">
            {task.assignedTo?.name || "Unassigned"}
          </span>
        </div>
      )}
    </div>
  );
}