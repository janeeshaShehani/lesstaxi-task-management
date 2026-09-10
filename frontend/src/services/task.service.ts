import api from "./api";
import { Task, TaskStatus } from "../types/task";

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");

  console.log("GET /tasks RESPONSE:", response.data);

  const data = response.data;

  // Backend may return:
  // 1. [...]
  // 2. { tasks: [...] }
  // 3. { data: [...] }
  // 4. { data: { tasks: [...] } }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.tasks)) {
    return data.tasks;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.tasks)) {
    return data.data.tasks;
  }

  console.error(
    "Unexpected /tasks response format:",
    data
  );

  return [];
};

// Get one task
export const getTask = async (
  taskId: string
): Promise<Task> => {
  const response = await api.get(
    `/tasks/${taskId}`
  );

  const data = response.data;

  if (data?.data) {
    return data.data;
  }

  return data;
};

// Create task
export const createTask = async (taskData: {
  title: string;
  description?: string;
}): Promise<Task> => {
  const response = await api.post(
    "/tasks",
    taskData
  );

  const data = response.data;

  if (data?.data) {
    return data.data;
  }

  return data;
};

// Update task
export const updateTask = async (
  taskId: string,
  taskData: {
    title?: string;
    description?: string;
  }
): Promise<Task> => {
  const response = await api.put(
    `/tasks/${taskId}`,
    taskData
  );

  const data = response.data;

  if (data?.data) {
    return data.data;
  }

  return data;
};

// Delete task
export const deleteTask = async (
  taskId: string
): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};

// Update task status
export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus
): Promise<Task> => {
  const response = await api.patch(
    `/tasks/${taskId}/status`,
    {
      status,
    }
  );

  const data = response.data;

  if (data?.data) {
    return data.data;
  }

  return data;
};

// Assign task to yourself
export const assignTaskToSelf = async (
  taskId: string
): Promise<Task> => {
  const response = await api.patch(
    `/tasks/${taskId}/assign-self`
  );

  const data = response.data;

  if (data?.data) {
    return data.data;
  }

  return data;
};

// Admin assign / reassign / unassign
export const assignTask = async (
  taskId: string,
  userId: string | null
): Promise<Task> => {
  const response = await api.patch(
    `/tasks/${taskId}/assign`,
    {
      assignedToId: userId,
    }
  );

  const data = response.data;

  if (data?.data) {
    return data.data;
  }

  return data;
};