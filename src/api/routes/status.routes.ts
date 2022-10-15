import { Router } from "express";

import { Routes } from "../interfaces/routes.interfaces";
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
  }
}
