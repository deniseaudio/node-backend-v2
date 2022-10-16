import { Router } from "express";
import { body } from "express-validator";

import { Routes } from "../interfaces/routes.interfaces";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validatorMiddleware } from "../middlewares/validator.middleware";
import { StatusController } from "../controllers/status.controller";

export class StatusRoute implements Routes {
  public path = "/status/";

  public router = Router();

  public statusController = new StatusController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}indexer`,
      this.statusController.getIndexerStatus
    );

    this.router.post(
      `${this.path}toggle-indexer`,
      [body("action").isIn(["start", "stop"])],
      // @ts-ignore
      authMiddleware,
      validatorMiddleware,
      this.statusController.toggleIndexer
    );
  }
}
