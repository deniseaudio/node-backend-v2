/* eslint import/no-extraneous-dependencies: "off" */
import type { User } from "@prisma/client";
import { hash } from "bcryptjs";
import request from "supertest";

import { prismaMock } from "./jest-prisma-singleton";
import { App } from "../api/App";

/**
 * Auto-login a mocked user and returns an Authorization cookie to be used in
 * subsequent requests that may require an authenticated user.
 *
 * @param app Server application.
 * @returns Authorization cookie.
 */
export const autologin = async (app: App) => {
  const user: User = {
    id: 1,
    email: "hello@jest.com",
    username: "jest",
    password: "JestPa$$word123!",
    lowBandwidthBitrate: 160,
    lowBandwidthEnabled: true,
  };

  // Pre-hash password to match it later.
  const hashedPassword = await hash(user.password, 10);

  // Used in the auth service to retrieve user and match password with.
  prismaMock.user.findByEmail.mockResolvedValue({
    ...user,
    password: hashedPassword,
  });

  // Used in the auth service to retrieve user likes.
  prismaMock.user.getSongsLiked.mockResolvedValue({ likes: [] });

  // Used in the auth middleware to retrieve user.
  prismaMock.user.findById.mockResolvedValue(user);

  const response = await request(app.getServer())
    .post("/auth/login")
    .send({ email: user.email, password: user.password })
    .expect(200);

  // Contains the entire cookie response with Authorization, Max-Age, HttpOnly.
  const cookie = response.headers["set-cookie"][0];

  expect(cookie).toBeDefined();
  expect(cookie).toContain("Authorization=");
  expect(cookie).toContain("HttpOnly;");
  expect(cookie).toContain("Max-Age=");

  // Cut the cookie to only get the Authorization value, which should be at the
  // first place.
  const authorization = cookie.split(";")[0] as string;

  expect(authorization).toBeDefined();
  expect(authorization.startsWith("Authorization=")).toBe(true);

  return { authorization };
};
