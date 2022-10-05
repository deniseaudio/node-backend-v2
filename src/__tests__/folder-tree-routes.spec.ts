import request from "supertest";

import { prismaMock } from "../jest-prisma-singleton";
import { autologin } from "../test-utils";
import { App } from "../api/App";
import { AuthRoute } from "../api/routes/auth.routes";
import { FolderTreeRoute } from "../api/routes/folder-tree.routes";

describe("Folder-tree routes testing", () => {
  describe("GET /folder-tree/root-directories", () => {
    it("should send a 200 with a list of root-directories indexed", async () => {
      const rootdir = {
        id: 1,
        parentId: null,
        name: "jest-root",
        path: "/jest-root",
        root: true,
        children: [],
      };

      const app = new App([new AuthRoute(), new FolderTreeRoute()]);
      const { authorization } = await autologin(app);

      // Mock the entire Prisma object response.
      prismaMock.directory.findRootDirectories.mockResolvedValue([rootdir]);

      const response = await request(app.getServer())
        .get("/folder-tree/root-directories")
        .set("Cookie", authorization)
        .expect(200);

      const { data } = response.body;

      expect(data.length).toBe(1);

      // Make sure the response is edited and doesn't send the whole Prisma
      // payload because we filter some values to send to the client.
      expect(data[0]).toMatchObject({
        id: rootdir.id,
        name: rootdir.name,
        root: rootdir.root,
        children: [],
      });
    });

    it("should send a 401 when user is not logged", async () => {
      const app = new App([new AuthRoute(), new FolderTreeRoute()]);

      return request(app.getServer())
        .get("/folder-tree/root-directories")
        .expect(401);
    });

    it("should send a 500 if the controller throws an error", async () => {
      const app = new App([new AuthRoute(), new FolderTreeRoute()]);
      const { authorization } = await autologin(app);

      // Mock Prisma error rejection that should be handled inside the controller.
      prismaMock.directory.findRootDirectories.mockImplementation(() => {
        throw new Error("Mocked error");
      });

      return request(app.getServer())
        .get("/folder-tree/root-directories")
        .set("Cookie", authorization)
        .expect(500);
    });
  });

  describe("GET /folder-tree/directory", () => {
    it("should send a 200 with a directory found by its id", async () => {
      const dir = {
        id: 2,
        parentId: 1,
        name: "child",
        path: "/jest-root/child",
        root: false,
        children: [],
        songs: [],
      };

      const app = new App([new AuthRoute(), new FolderTreeRoute()]);
      const { authorization } = await autologin(app);

      // Mock the entire Prisma object response.
      prismaMock.directory.findById.mockResolvedValue(dir);

      const response = await request(app.getServer())
        .get("/folder-tree/directory?id=2")
        .set("Cookie", authorization)
        .expect(200);

      const { data } = response.body;

      // Make sure the response is edited and doesn't send the whole Prisma
      // payload because we filter some values to send to the client.
      expect(data).toMatchObject({
        id: dir.id,
        parentId: dir.parentId,
        name: dir.name,
        root: dir.root,
        children: [],
        songs: [],
      });
    });

    it("should send a 400 when no directory parameter is passed", async () => {
      const app = new App([new AuthRoute(), new FolderTreeRoute()]);
      const { authorization } = await autologin(app);

      return request(app.getServer())
        .get("/folder-tree/directory")
        .set("Cookie", authorization)
        .expect(400);
    });

    it("should send a 400 if the directory parameter is invalid", async () => {
      const app = new App([new AuthRoute(), new FolderTreeRoute()]);
      const { authorization } = await autologin(app);

      return request(app.getServer())
        .get("/folder-tree/directory?id=hello")
        .set("Cookie", authorization)
        .expect(400);
    });

    it("should send a 400 if the parameter name is not valid", async () => {
      const app = new App([new AuthRoute(), new FolderTreeRoute()]);
      const { authorization } = await autologin(app);

      return request(app.getServer())
        .get("/folder-tree/directory?invalid=hello")
        .set("Cookie", authorization)
        .expect(400);
    });

    it("should send a 404 if the directory doesn't exist", async () => {
      const app = new App([new AuthRoute(), new FolderTreeRoute()]);
      const { authorization } = await autologin(app);

      prismaMock.directory.findById.mockResolvedValue(null);

      return request(app.getServer())
        .get("/folder-tree/directory?id=123456789")
        .set("Cookie", authorization)
        .expect(404);
    });

    it("should send a 401 when user is not logged", async () => {
      const app = new App([new AuthRoute(), new FolderTreeRoute()]);

      return request(app.getServer())
        .get("/folder-tree/directory?id=2")
        .expect(401);
    });

    it("should send a 500 if the controller throws an error", async () => {
      const app = new App([new AuthRoute(), new FolderTreeRoute()]);
      const { authorization } = await autologin(app);

      // Mock Prisma error rejection that should be handled inside the controller.
      prismaMock.directory.findById.mockImplementation(() => {
        throw new Error("Mocked error");
      });

      return request(app.getServer())
        .get("/folder-tree/directory?id=2")
        .set("Cookie", authorization)
        .expect(500);
    });
  });
});
