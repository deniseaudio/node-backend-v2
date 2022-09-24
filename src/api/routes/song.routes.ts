import { Router } from "express";
import { query } from "express-validator";

import { Routes } from "../interfaces/routes.interfaces";
import { SongController } from "../controllers/song.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { queryParserMiddleware } from "../middlewares/query-parser.middleware";

export class SongRoute implements Routes {
  public path = "/songs/";

  public router = Router();

  public songController = new SongController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}stream`,
      [query("id").isInt({ min: 1 })],
      // @ts-ignore
      authMiddleware,
      queryParserMiddleware,
      this.songController.getSongStream
    );

    this.router.get(
      `${this.path}cover`,
      [query("id").isInt({ min: 1 })], // @ts-ignore
      authMiddleware,
      queryParserMiddleware,
      this.songController.getSongCover
    );
  }
}
