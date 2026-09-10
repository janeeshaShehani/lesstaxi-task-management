"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

import { Task, TaskStatus } from "../../types/task";
import { User } from "../../types/user";
import TaskCard from "./TaskCard";
import { updateTaskStatus } from "../../services/task.service";

interface TaskBoardProps {
  tasks: Task[];

  // Normal user dashboard
  currentUserId?: string;
  onTasksUpdated: (tasks: Task[]) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onAssignToSelf?: (task: Task) => void;

  // Admin dashboard
  isAdmin?: boolean;
  users?: User[];
  onAssign?: (
    taskId: string,
    userId: string | null
  ) => void;
}

const columns: {
  id: TaskStatus;
  title: string;
}[] = [
  {
    id: "TODO",
    title: "To Do",
  },
  {
    id: "DOING",
    title: "Doing",
  },
  {
    id: "DONE",
    title: "Done",
  },
];

export default function TaskBoard({
  tasks,
  currentUserId = "",
  onTasksUpdated,
  onEdit,
  onDelete,
  onAssignToSelf,
  isAdmin = false,
  users = [],
  onAssign,
}: TaskBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = async (
    event: DragEndEvent
  ) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = String(active.id);
    const newStatus = String(over.id) as TaskStatus;

    const validStatuses: TaskStatus[] = [
      "TODO",
      "DOING",
      "DONE",
    ];

    if (!validStatuses.includes(newStatus)) {
      return;
    }

    const currentTask = tasks.find(
      (task) => task.id === taskId
    );

    if (!currentTask) {
      return;
    }

    // Nothing changed
    if (currentTask.status === newStatus) {
      return;
    }

    // Keep old state for rollback
    const previousTasks = [...tasks];

    // Optimistic update
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status: newStatus,
          }
        : task
    );

    onTasksUpdated(updatedTasks);

    try {
      // updateTaskStatus returns a Task directly
      const updatedTask = await updateTaskStatus(
        taskId,
        newStatus
      );

      const finalTasks = updatedTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updatedTask,
            }
          : task
      );

      onTasksUpdated(finalTasks);

      toast.success("Task status updated");
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error
      );

      // Rollback
      onTasksUpdated(previousTasks);

      toast.error("Failed to update task status");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.id
          );

          return (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={columnTasks}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              onAssignToSelf={onAssignToSelf}
              isAdmin={isAdmin}
              users={users}
              onAssign={onAssign}
            />
          );
        })}
      </div>
    </DndContext>
  );
}

interface DroppableColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];

  currentUserId?: string;
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

function DroppableColumn({
  id,
  title,
  tasks,
  currentUserId = "",
  onEdit,
  onDelete,
  onAssignToSelf,
  isAdmin = false,
  users = [],
  onAssign,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[500px] rounded-2xl border p-4 transition ${
        isOver
          ? "border-indigo-400 bg-indigo-50"
          : "border-slate-200 bg-slate-100/70"
      }`}
    >
      {/* Column header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">
          {title}
        </h2>

        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
            <p className="text-sm text-slate-400">
              Drop tasks here
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <DraggableTask
              key={task.id}
              task={task}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              onAssignToSelf={onAssignToSelf}
              isAdmin={isAdmin}
              users={users}
              onAssign={onAssign}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface DraggableTaskProps {
  task: Task;

  currentUserId?: string;
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

function DraggableTask({
  task,
  currentUserId = "",
  onEdit,
  onDelete,
  onAssignToSelf,
  isAdmin = false,
  users = [],
  onAssign,
}: DraggableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none",
  };

  const isCreator =
    currentUserId !== "" &&
    task.createdById === currentUserId;

  const canEdit =
    isAdmin || isCreator;

  const canDelete =
    isAdmin || isCreator;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`select-none transition ${
        isDragging
          ? "scale-[1.02] cursor-grabbing opacity-60"
          : "cursor-grab opacity-100"
      }`}
    >
      <TaskCard
        task={task}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={onEdit}
        onDelete={onDelete}
        onAssignToSelf={onAssignToSelf}
        isAdmin={isAdmin}
        users={users}
        onAssign={onAssign}
      />
    </div>
  );
}