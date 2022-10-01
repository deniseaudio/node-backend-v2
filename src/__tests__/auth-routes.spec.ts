import type { User } from "@prisma/client";
import request from "supertest";

import { prismaMock } from "../jest-prisma-singleton";
import { App } from "../api/App";
import { AuthRoute } from "../api/routes/auth.routes";

const user: User = {
  id: 1,
  email: "hello@jest.com",
  username: "jest",
  password: "JestPa$$word123!",
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
      expect(response.body.data.password).not.toBeDefined();
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
  });
});
