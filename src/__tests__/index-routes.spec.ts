import request from "supertest";

import { App } from "../api/App";
import { IndexRoute } from "../api/routes/index.routes";

describe("Index routes testing", () => {
  describe("GET /", () => {
    it("should send a 200", () => {
      const routes = new IndexRoute();
      const app = new App([routes]);

      return request(app.getServer()).get(routes.path).expect(200);
    });
  });
});
