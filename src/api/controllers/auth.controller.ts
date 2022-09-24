import type { Request, Response, NextFunction } from "express";

import type { RequestWithUser } from "../interfaces/auth.interfaces";

import type { UserData } from "../interfaces/user.interfaces";
import { AuthService } from "../services/auth.service";
import { REGISTER_SECRET_KEY } from "../config";

export class AuthController {
  private authService = new AuthService();

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as UserData;

      if (payload.secretKey !== REGISTER_SECRET_KEY) {
        res.status(401).json({ action: "signup", error: "Invalid secret-key" });
      }

      const userdata = await this.authService.signup(payload);

      res.status(201).json({ message: "signup", data: userdata });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userdata = req.body as UserData;
      const { cookie, user } = await this.authService.login(userdata);

      res.setHeader("Set-Cookie", [cookie]);
      res.status(200).json({ message: "login", data: user });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userdata = req.user;

      await this.authService.logout(userdata.email);

      res.setHeader("Set-Cookie", ["Authorization=; Max-Age=0"]);
      res.status(200).json({ message: "logout", data: {} });
    } catch (error) {
      next(error);
    }
  };
}
