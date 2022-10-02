import request from "supertest";

import { prismaMock } from "../jest-prisma-singleton";
import { App } from "../api/App";
import { AuthRoute } from "../api/routes/auth.routes";

describe("Auth middleware testing", () => {
  describe("POST /auth/logout", () => {
    it("should send a 401 when not passing an Authorization token with cookies", async () => {
      const routes = new AuthRoute();
      const app = new App([routes]);

      const response = await request(app.getServer())
        .post(`${routes.path}logout`)
        .expect(401);

      expect(response.body.error).toContain("Unauthorized");
    });

    it("should send a 401 when not passing an Authorization token with headers", async () => {
      const routes = new AuthRoute();
      const app = new App([routes]);

      const response = await request(app.getServer())
        .post(`${routes.path}logout`)
        .set("Authorization", "Bearer")
        .expect(401);

      expect(response.body.error).toContain("Unauthorized");
    });

    it("should send a 401 when passing an invalid Authorization token", async () => {
      const routes = new AuthRoute();
      const app = new App([routes]);

      const response = await request(app.getServer())
        .post(`${routes.path}logout`)
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.error).toContain("Unauthorized");
    });

    it("should send a 401 if user cannot be found", async () => {
      prismaMock.user.findById.mockResolvedValue(null);

      const routes = new AuthRoute();
      const app = new App([routes]);

      const response = await request(app.getServer())
        .post(`${routes.path}logout`)
        .set("Authorization", "Bearer valid-token")
        .expect(401);

      expect(response.body.error).toContain("Unauthorized");
    });

    it("should send a 401 if middleware throws an error", async () => {
      prismaMock.user.findById.mockImplementation(() => {
        throw new Error("Mocked error");
      });

      const routes = new AuthRoute();
      const app = new App([routes]);

      const response = await request(app.getServer())
        .post(`${routes.path}logout`)
        .set("Authorization", "Bearer valid-token")
        .expect(401);

      expect(response.body.error).toContain("Unauthorized");
    });
  });
});
