import { Router } from "express";
import { query, body } from "express-validator";

import { Routes } from "../interfaces/routes.interfaces";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validatorMiddleware } from "../middlewares/validator.middleware";
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
      validatorMiddleware,
      queryParserMiddleware,
      this.userController.toggleSongLike
    );

    this.router.post(
      `${this.path}update-options`,
      [
        body("lowBandwidthEnabled").isBoolean(),
        body("lowBandwidthBitrate").isIn(["128", "160", "192", "256", "320"]),
      ],
      // @ts-ignore
      authMiddleware,
      validatorMiddleware,
      this.userController.updateUserOptions
    );
  }
}
