import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { HttpException } from "../exceptions/HttpException";

export const validatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
  } else {
    const errorMessage = errors
      .array()
      .map((error) => `${error.location}[${error.param}]: ${error.msg}`)
      .join(", ");

    throw new HttpException(400, errorMessage);
  }
};
