import type { Request } from "express";

import type { User } from "./user.interfaces";

export type DataStoredInToken = {
  id: number;
};

export type TokenData = {
  token: string;
  expiresIn: number;
};

export interface RequestWithUser extends Request {
  user: User;
}
