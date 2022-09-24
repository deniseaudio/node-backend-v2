import type { Request, Response, NextFunction } from "express";

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

  public getDirectory = async (
    req: RequestWithUser & Request<{}, {}, {}, { id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.query;
      const parsedId = Number.parseInt(id, 10);

      if (Number.isNaN(parsedId)) {
        res.status(400).send({ message: "getDirectory", error: "Invalid id" });
        return;
      }

      const directory = await this.folderTreeService.getDirectory(parsedId);

      if (!directory) {
        res
          .status(404)
          .send({ message: "getDirectory", error: "No directory found" });
        return;
      }

      res.status(200).send({ message: "getDirectory", data: directory });
    } catch (error) {
      next(error);
    }
  };
}
