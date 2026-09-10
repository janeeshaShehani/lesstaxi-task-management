import {
  Request,
  Response,
  NextFunction,
} from "express";

export const notFoundHandler = (
  req: Request,
  res: Response
): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Unhandled error:", error);

  if (error instanceof Error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};