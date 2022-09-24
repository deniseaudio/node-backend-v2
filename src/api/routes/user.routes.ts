import { Router } from "express";
import { query } from "express-validator";

import { Routes } from "../interfaces/routes.interfaces";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { queryParserMiddleware } from "../middlewares/query-parser.middleware";

export class UserRoute implements Routes {
  public path = "/user/";

  public router = Router();

  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}songs-liked`,
      // @ts-ignore
      authMiddleware,
      this.userController.getSongsLiked
    );

    this.router.post(
      `${this.path}toggle-song-like`,
      [query("id").isInt({ min: 1 })],
      // @ts-ignore
      authMiddleware,
      queryParserMiddleware,
      this.userController.toggleSongLike
    );
  }
}
