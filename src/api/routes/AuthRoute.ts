import { Router } from "express";
import { check } from "express-validator";

import { Routes } from "../interfaces/routes.interfaces";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validatorMiddleware } from "../middlewares/validator.middleware";

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
      validatorMiddleware,
      this.authController.signup
    );

    this.router.post(
      `${this.path}login`,
      [check("email").normalizeEmail().isEmail(), check("password").isString()],
      validatorMiddleware,
      this.authController.login
    );

    this.router.post(
      `${this.path}logout`,
      validatorMiddleware,
      // @ts-ignore
      authMiddleware,
      this.authController.logout
    );
  }
}