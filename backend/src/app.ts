import express, { Request, Response } from "express";
import cors from "cors";

import routes from "./routes";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.get(
  "/api/health",
  (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Lesstaxi Task Management API is running",
    });
  }
);

app.use("/api", routes);

/*
 * 404 handler
 */
app.use(notFoundHandler);

/*
 * Global error handler
 */
app.use(errorHandler);

export default app;