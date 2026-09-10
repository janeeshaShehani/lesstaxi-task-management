import { User } from "./user";

export type TaskStatus = "TODO" | "DOING" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdById: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  assignedTo?: User | null;
}