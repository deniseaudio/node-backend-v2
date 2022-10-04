import type { Request, Response, NextFunction } from "express";

import type { RequestWithUser } from "../interfaces/auth.interfaces";
import { UserService } from "../services/user.service";

export class UserController {
  private userService = new UserService();

  public getSongsLiked = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const likes = await this.userService.getSongsLiked(req.user.id);

      res.status(200).send({ message: "getSongsLiked", data: likes || [] });
    } catch (error) {
      next(error);
    }
  };

  public toggleSongLike = async (
    req: RequestWithUser & Request<{}, {}, {}, { id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.query;
      const likes = await this.userService.toggleSongLike(req.user.id, id);

      res.status(200).send({ message: "toggleSongLike", data: likes || [] });
    } catch (error) {
      next(error);
    }
  };
}
