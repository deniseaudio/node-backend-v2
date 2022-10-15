import type { User } from "@prisma/client";
import { hash } from "bcryptjs";
import request from "supertest";

import { prismaMock } from "../test-utils/jest-prisma-singleton";
import { autologin } from "../test-utils/jest-autologin";
import { App } from "../api/App";
import { AuthRoute } from "../api/routes/auth.routes";

const user: User = {
  id: 1,
  email: "hello@jest.com",
  username: "jest",
  password: "JestPa$$word123!",
  lowBandwidthEnabled: true,
  lowBandwidthBitrate: 128,
};

describe("Index routes testing", () => {
  describe("POST /auth/signup", () => {
    it("should send a 201 when user created", async () => {
      prismaMock.user.findByEmail.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(user);

      const routes = new AuthRoute();
      const app = new App([routes]);

      const response = await request(app.getServer())
        .post(`${routes.path}signup`)
        .send({
          email: user.email,
          username: user.username,
          password: user.password,
          secretKey: "jest-secret-key",
        })
        .expect(201);

      expect(response.body.data.id).toBe(user.id);
      expect(response.body.data.username).toBe(user.username);
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.likes).toMatchObject([]);
      expect(response.body.data.password).not.toBeDefined();
    });

    it("should send a 400 when passing an invalid email", async () => {
      const routes = new AuthRoute();
      const app = new App([routes]);

      const response = await request(app.getServer())
        .post(`${routes.path}signup`)
        .send({
          email: "not-an-email",
          username: user.username,
          password: user.password,
          secretKey: "jest-secret-key",
        })
        .expect(400);

      expect(response.body.error).toContain("body[email]");
    });

    it("should send a 400 when passing an invalid username", async () => {
      const routes = new AuthRoute();
      const app = new App([routes]);

      const response = await request(app.getServer())
        .post(`${routes.path}signup`)
        .send({
          email: user.email,
          username: "_",
          password: user.password,
          secretKey: "jest-secret-key",
        })
        .expect(400);

      expect(response.body.error).toContain("body[username]");
    });

    it("should send a 400 when passing an invalid password", async () => {
      const routes = new AuthRoute();
      const app = new App([routes]);

      const response = await request(app.getServer())
        .post(`${routes.path}signup`)
        .send({
          email: user.email,
          username: user.email,
          password: "___",
          secretKey: "jest-secret-key",
        })
        .expect(400);

      expect(response.body.error).toContain("body[password]");
    });

    it("should send a 401 when user don't have a valid secret-key", async () => {
      const routes = new AuthRoute();
      const app = new App([routes]);

      const response = await request(app.getServer())
        .post(`${routes.path}signup`)
        .send({
          email: user.email,
          username: user.username,
          password: user.password,
          secretKey: "invalid-secret-key",
        })
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    it("should send a 409 if the email is already used", async () => {
      prismaMock.user.findByEmail.mockResolvedValue(user);

      const routes = new AuthRoute();
      const app = new App([routes]);

      return request(app.getServer())
        .post(`${routes.path}signup`)
        .send({
          email: user.email,
          username: user.username,
          password: user.password,
          secretKey: "jest-secret-key",
        })
        .expect(409);
    });

    it("should send a 500 if the controller throw an error", async () => {
      prismaMock.user.findByEmail.mockImplementation(() => {
        throw new Error("Mocked error");
      });

      const routes = new AuthRoute();
      const app = new App([routes]);

      return request(app.getServer())
        .post(`${routes.path}signup`)
        .send({
          email: user.email,
          username: user.username,
          password: user.password,
          secretKey: "jest-secret-key",
        })
        .expect(500);
    });
  });

  describe("POST /auth/login", () => {
    it("should send a 200 when user is logged and contains the Authorization cookie", async () => {
      // Pre-hash password to match it later.
      const hashedPassword = await hash(user.password, 10);

      // Used in auth service.
      prismaMock.user.findByEmail.mockResolvedValue({
        ...user,
        password: hashedPassword,
      });

      // Used in auth service, after `findByEmail`.
      prismaMock.user.getSongsLiked.mockResolvedValue({ likes: [] });

      const routes = new AuthRoute();
      const app = new App([routes]);

      const response = await request(app.getServer())
        .post(`${routes.path}login`)
        .send({ email: user.email, password: user.password })
        .expect(200);

      const authorization = response.headers["set-cookie"][0];

      expect(response.body.data.id).toBe(user.id);
      expect(response.body.data.username).toBe(user.username);
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.likes).toMatchObject([]);
      expect(response.body.data.password).not.toBeDefined();
      expect(authorization).toBeDefined();
      expect(authorization).toContain("Authorization=");
      expect(authorization).toContain("HttpOnly;");
      expect(authorization).toContain("Max-Age=");
    });

    it("should send a 401 if email is unknown", async () => {
      prismaMock.user.findByEmail.mockResolvedValue(null);

      const routes = new AuthRoute();
      const app = new App([routes]);

      return request(app.getServer())
        .post(`${routes.path}login`)
        .send({ email: user.email, password: user.password })
        .expect(401);
    });

    it("should send a 401 if password is incorrect", async () => {
      prismaMock.user.findByEmail.mockResolvedValue(user);

      const routes = new AuthRoute();
      const app = new App([routes]);

      return request(app.getServer())
        .post(`${routes.path}login`)
        .send({ email: user.email, password: "invalid-password" })
        .expect(401);
    });

    it("should send a 500 if the controller throw an error", async () => {
      prismaMock.user.findByEmail.mockImplementation(() => {
        throw new Error("Mocked error");
      });

      const routes = new AuthRoute();
      const app = new App([routes]);

      return request(app.getServer())
        .post(`${routes.path}login`)
        .send({ email: user.email, password: user.password })
        .expect(500);
    });
  });

  describe("POST /auth/logout", () => {
    it("should send a 200 when user is logout and remove Authorization cookie", async () => {
      // First, login user to retrieve auth cookie.
      // Pre-hash password to match it later.
      const hashedPassword = await hash(user.password, 10);

      // Used in the auth middleware to retrieve user.
      prismaMock.user.findById.mockResolvedValue(user);

      prismaMock.user.findByEmail.mockResolvedValue({
        ...user,
        password: hashedPassword,
      });

      const routes = new AuthRoute();
      const app = new App([routes]);

      const loginResponse = await request(app.getServer())
        .post(`${routes.path}login`)
        .send({ email: user.email, password: user.password })
        .expect(200);

      const authorization = loginResponse.headers["set-cookie"][0];

      // Then, logout user.
      const logoutResponse = await request(app.getServer())
        .post(`${routes.path}logout`)
        .set("Cookie", authorization)
        .expect(200);

      expect(logoutResponse.headers["set-cookie"][0]).toBe(
        "Authorization=; Max-Age=0"
      );
    });

    it("should send a 401 when user is not logged", async () => {
      const routes = new AuthRoute();
      const app = new App([routes]);

      return request(app.getServer()).post(`${routes.path}logout`).expect(401);
    });

    it("should send a 401 if the service throw an error", async () => {
      // First, login user to retrieve auth cookie.
      // Pre-hash password to match it later.
      const hashedPassword = await hash(user.password, 10);

      // Used in the auth middleware to retrieve user.
      prismaMock.user.findById.mockImplementation(() => {
        throw new Error("Mocked error");
      });

      prismaMock.user.findByEmail.mockResolvedValue({
        ...user,
        password: hashedPassword,
      });

      const routes = new AuthRoute();
      const app = new App([routes]);

      const loginResponse = await request(app.getServer())
        .post(`${routes.path}login`)
        .send({ email: user.email, password: user.password })
        .expect(200);

      const authorization = loginResponse.headers["set-cookie"][0];

      // Then, logout user.
      return request(app.getServer())
        .post(`${routes.path}logout`)
        .set("Cookie", authorization)
        .expect(401);
    });

    it("should send a 500 if the controller throw an error", async () => {
      const routes = new AuthRoute();
      const app = new App([routes]);
      const { authorization } = await autologin(app);

      prismaMock.user.findByEmail.mockImplementation(() => {
        throw new Error("Mocked error");
      });

      return request(app.getServer())
        .post(`${routes.path}logout`)
        .set("Cookie", authorization)
        .expect(500);
    });
  });
});
