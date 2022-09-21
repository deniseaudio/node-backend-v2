import type { Request, Response, NextFunction } from "express";

import { HttpException } from "../exceptions/HttpException";
import { logger } from "../utils/logger";

export const errorMiddleware = (
  errorException: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = errorException.status || 500;
    const message = errorException.message || "Something went wrong";

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    );

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
