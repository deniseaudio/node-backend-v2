import { sign } from "jsonwebtoken";
import { hash, compare } from "bcryptjs";

import type { UserData } from "../interfaces/user.interfaces";
import type {
  TokenData,
  DataStoredInToken,
} from "../interfaces/auth.interfaces";
import { HttpException } from "../exceptions/HttpException";
import { mapUser } from "../utils/payload-transform";
import { prismaClient } from "../../prisma-client";
import { SECRET_KEY } from "../../config";

export class AuthService {
  public async signup(userdata: UserData) {
    const exists = await prismaClient.user.findByEmail(userdata.email);

    if (exists) {
      throw new HttpException(
        409,
        `This email ${userdata.email} is already in use.`
      );
    }

    const hashedPassword = await hash(userdata.password, 10);
    const user = await prismaClient.user.create({
      email: userdata.email,
      username: userdata.username,
      password: hashedPassword,
    });

    const transformedUser = mapUser(user, []);

    return transformedUser;
  }

  public async login(userdata: UserData) {
    const exists = await prismaClient.user.findByEmail(userdata.email);

    if (!exists) {
      throw new HttpException(401, "Invalid email or password");
    }

    const likes = await prismaClient.user.getSongsLiked(exists.id);

    const isPasswordMatching = await compare(
      userdata.password,
      exists.password
    );

    if (!isPasswordMatching) {
      throw new HttpException(401, "Invalid email or password");
    }

    const tokenData = this.createToken(exists.id);
    const cookie = this.createCookie(tokenData);
    const transformedUser = mapUser(exists, likes?.likes || []);

    return { cookie, user: transformedUser };
  }

  public async logout(email: string) {
    const exists = await prismaClient.user.findByEmail(email);

    if (!exists) {
      throw new HttpException(409, "User doesn't exist");
    }

    return exists;
  }

  private createToken(userId: number): TokenData {
    const tokenData: DataStoredInToken = { id: userId };
    const secretKey = SECRET_KEY as string;
    const expiresIn = 60 * 60 * 24 * 30;

    const signedToken = sign(tokenData, secretKey, { expiresIn });

    return { expiresIn, token: signedToken };
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; Path=/; SameSite=None; HttpOnly; Secure; Max-Age=${tokenData.expiresIn}`;
  }
}
