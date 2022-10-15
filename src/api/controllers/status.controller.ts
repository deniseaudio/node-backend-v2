import type { Request, Response, NextFunction } from "express";

import { walker } from "../../indexer/indexer";

export class StatusController {
  public getIndexerStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.status(200).json({ isIndexing: walker.isIndexing });
    } catch (error) {
      next(error);
    }
  };
}
