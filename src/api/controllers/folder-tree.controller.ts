import type { Response, NextFunction } from "express";

import type { RequestWithUser } from "../interfaces/auth.interfaces";
import { FolderTreeService } from "../services/folder-tree.service";

export class FolderTreeController {
  private folderTreeService = new FolderTreeService();

  public getRootDirectories = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const rootDirectories = await this.folderTreeService.getRootDirectories();

      res
        .status(200)
        .send({ message: "getRootDirectories", data: rootDirectories });
    } catch (error) {
      next(error);
    }
  };
}
