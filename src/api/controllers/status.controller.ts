import type { Request, Response, NextFunction } from "express";

import type { RequestWithUser } from "../interfaces/auth.interfaces";
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

  public toggleIndexer = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (walker.isIndexing) {
        walker.stop();
      } else {
        walker.walk();
      }

      res.status(200).json({ isIndexing: walker.isIndexing });
    } catch (error) {
      next(error);
    }
  };
}
