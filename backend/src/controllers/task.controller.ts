import { Request, Response } from "express";
import { TaskStatus } from "../generated/prisma/client";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTaskToSelf,
  assignTask,
} from "../services/task.service";

/**
 * Create a new task
 * POST /api/tasks
 */
export const createTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { title, description } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      res.status(400).json({
        success: false,
        message: "Title is required",
      });
      return;
    }

    const task = await createTask({
      title: title.trim(),
      description,
      createdById: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

/**
 * Get tasks
 * GET /api/tasks
 *
 * ADMIN  -> gets all tasks
 * USER   -> gets tasks created by them or assigned to them
 */
export const getTasksController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const tasks = await getTasks(
      req.user.id,
      req.user.role === "ADMIN"
    );

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

/**
 * Get a single task
 * GET /api/tasks/:id
 */
export const getTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const task = await getTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // Check authentication
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // ADMIN can view any task
    // USER can view only tasks they created or are assigned to
    const isAdmin = req.user.role === "ADMIN";
    const isCreator = task.createdById === req.user.id;
    const isAssignedUser = task.assignedToId === req.user.id;

    if (!isAdmin && !isCreator && !isAssignedUser) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to view this task",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

/**
 * Update a task
 * PUT /api/tasks/:id
 *
 * USER  -> can update tasks they created
 * ADMIN -> can update any task
 */
export const updateTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const id = String(req.params.id);
    const { title, description } = req.body;

    const task = await getTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    const isAdmin = req.user.role === "ADMIN";
    const isCreator = task.createdById === req.user.id;

    if (!isAdmin && !isCreator) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to update this task",
      });
      return;
    }

    if (
      title !== undefined &&
      (typeof title !== "string" || !title.trim())
    ) {
      res.status(400).json({
        success: false,
        message: "Title must be a non-empty string",
      });
      return;
    }

    const updatedTask = await updateTask(id, {
      title: title !== undefined ? title.trim() : undefined,
      description,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

/**
 * Delete a task
 * DELETE /api/tasks/:id
 *
 * USER  -> can delete tasks they created
 * ADMIN -> can delete any task
 */
export const deleteTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const id = String(req.params.id);

    const task = await getTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    const isAdmin = req.user.role === "ADMIN";
    const isCreator = task.createdById === req.user.id;

    if (!isAdmin && !isCreator) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to delete this task",
      });
      return;
    }

    await deleteTask(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

/**
 * Update task status
 * PATCH /api/tasks/:id/status
 *
 * USER  -> creator or assigned user
 * ADMIN -> any task
 */
export const updateTaskStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const id = String(req.params.id);
    const { status } = req.body;

    if (!Object.values(TaskStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid task status. Use TODO, DOING, or DONE",
      });
      return;
    }

    const task = await getTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    const isAdmin = req.user.role === "ADMIN";
    const isCreator = task.createdById === req.user.id;
    const isAssignedUser = task.assignedToId === req.user.id;

    if (!isAdmin && !isCreator && !isAssignedUser) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to move this task",
      });
      return;
    }

    const updatedTask = await updateTaskStatus(id, status);

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Update task status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task status",
    });
  }
};

/**
 * Assign an unassigned task to the authenticated user
 * PATCH /api/tasks/:id/assign-self
 */
export const assignTaskToSelfController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const id = String(req.params.id);

    const task = await getTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    const assignedTask = await assignTaskToSelf(
      id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Task assigned to you successfully",
      data: assignedTask,
    });
  } catch (error) {
    console.error("Assign task to self error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to assign task";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

/**
 * Assign or reassign a task
 * PATCH /api/tasks/:id/assign
 *
 * ADMIN ONLY
 */
export const assignTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const id = String(req.params.id);
    const { assignedToId } = req.body;

    const task = await getTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    // assignedToId can be null to remove an assignment
    if (
      assignedToId !== null &&
      assignedToId !== undefined &&
      typeof assignedToId !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "assignedToId must be a string or null",
      });
      return;
    }

    const updatedTask = await assignTask(
      id,
      assignedToId ?? null
    );

    res.status(200).json({
      success: true,
      message: "Task assignment updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Assign task error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to assign task";

    res.status(400).json({
      success: false,
      message,
    });
  }
};