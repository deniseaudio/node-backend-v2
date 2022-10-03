import { Router } from "express";
import { query } from "express-validator";

import { Routes } from "../interfaces/routes.interfaces";
import { SearchController } from "../controllers/search.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validatorMiddleware } from "../middlewares/validator.middleware";

export class SearchRoute implements Routes {
  public path = "/search/";

  public router = Router();

  public searchController = new SearchController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}songs`,
      [
        query("query").isString().isLength({ min: 3 }),
        query("type")
          .isString()
          .isIn(["default", "filename", "artist", "album"]),
      ],
      // @ts-ignore
      authMiddleware,
      validatorMiddleware,
      this.searchController.getSearchedSongs
    );
  }
}
