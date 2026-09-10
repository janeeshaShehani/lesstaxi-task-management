import { Router } from "express";

import {
  getAllUsersController,
  getUserByIdController,
} from "../controllers/user.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  requireRole("ADMIN"),
  getAllUsersController
);

router.get(
  "/admin-test",
  requireRole("ADMIN"),
  (_req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin! You have access to this route.",
    });
  }
);

router.get(
  "/:id",
  requireRole("ADMIN"),
  getUserByIdController
);

export default router;