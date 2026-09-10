import { Router } from "express";

import {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
  updateTaskStatusController,
  assignTaskToSelfController,
  assignTaskController,
} from "../controllers/task.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.post("/", createTaskController);

router.get("/", getTasksController);

router.get("/:id", getTaskController);

router.put("/:id", updateTaskController);

router.delete("/:id", deleteTaskController);

router.patch("/:id/status", updateTaskStatusController);

router.patch("/:id/assign-self", assignTaskToSelfController);

router.patch(
  "/:id/assign",
  requireRole("ADMIN"),
  assignTaskController
);

export default router;