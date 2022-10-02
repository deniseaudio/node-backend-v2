import type { Request, Response, NextFunction } from "express";

export const queryParserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // `id` is a common used query parameter.
  const { id } = req.query;

  // There are no `id` query parameter, skip middleware.
  if (!id || id.length === 0 || typeof id !== "string") {
    next();
    return;
  }

  const parsedId = Number.parseInt(id, 10);

  // Parsed ID is not a valid number, skip middleware.
  if (Number.isNaN(parsedId)) {
    next();
    return;
  }

  // The following code is illegal in TypeScript but is a quite common pattern in Express apps.
  // @ts-ignore
  req.query.id = parsedId;
  next();
};
