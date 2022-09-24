import type { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import type {
  DataStoredInToken,
  RequestWithUser,
} from "../interfaces/auth.interfaces";
import { SECRET_KEY } from "../../config";
import { HttpException } from "../exceptions/HttpException";
import { prismaClient } from "../../models/Prisma";

export const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization =
      (req.cookies.Authorization as string | undefined) ||
      (req.header("Authorization")
        ? req.header("Authorization")!.split("Bearer ")[1]
        : null);

    if (authorization) {
      const verificationResponse = (await verify(
        authorization,
        SECRET_KEY as string
      )) as DataStoredInToken;

      const exists = await prismaClient.user.findById(verificationResponse.id);

      if (exists) {
        req.user = {
          id: exists.id,
          email: exists.email,
          password: exists.password,
        };

        next();
      } else {
        next(new HttpException(401, "Wrong authentication token"));
      }
    } else {
      next(new HttpException(404, "Authentication token missing"));
    }
  } catch {
    next(new HttpException(401, "Wrong authentication token"));
  }
};
