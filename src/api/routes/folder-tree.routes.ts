import { Router } from "express";
import { query } from "express-validator";

import { Routes } from "../interfaces/routes.interfaces";
import { FolderTreeController } from "../controllers/folder-tree.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validatorMiddleware } from "../middlewares/validator.middleware";
import { queryParserMiddleware } from "../middlewares/query-parser.middleware";

export class FolderTreeRoute implements Routes {
  public path = "/folder-tree/";

  public router = Router();

  public folderTreeController = new FolderTreeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}root-directories`,
      // @ts-ignore
      authMiddleware,
      this.folderTreeController.getRootDirectories
    );

    this.router.get(
      `${this.path}directory`,
      [query("id").isInt({ min: 1 })],
      // @ts-ignore
      authMiddleware,
      validatorMiddleware,
      queryParserMiddleware,
      this.folderTreeController.getDirectory
    );
  }
}
