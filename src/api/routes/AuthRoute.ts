import { Router } from "express";
import { check } from "express-validator";

import { Routes } from "../interfaces/routes.interfaces";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/auth.middleware";

export class AuthRoute implements Routes {
  public path = "/";

  public router = Router();

  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}signup`,
      [
        check("email").normalizeEmail().isEmail(),
        check("username").isString(),
        check("password").isString(),
        check("secretKey").isString(),
      ],
      this.authController.signup
    );

    this.router.post(
      `${this.path}login`,
      [check("email").normalizeEmail().isEmail(), check("password").isString()],
      this.authController.login
    );

    this.router.post(
      `${this.path}logout`,
      // @ts-ignore
      authMiddleware,
      this.authController.logout
    );
  }
}
