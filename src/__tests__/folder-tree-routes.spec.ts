import type { Directory, Song } from "@prisma/client";
import request from "supertest";

import { prismaMock } from "../jest-prisma-singleton";
import { autologin } from "../test-utils";
import { App } from "../api/App";
import { AuthRoute } from "../api/routes/auth.routes";
import { FolderTreeRoute } from "../api/routes/folder-tree.routes";

type RootDirectory = Directory & {
  children: Directory[];
};

type ChildDirectory = Directory & {
  children: Directory[];
  songs: Song[];
};

const childdir: ChildDirectory = {
  id: 2,
  parentId: 1,
  name: "child",
  path: "/jest-root/child",
  root: false,
  children: [],
  songs: [],
};

const rootdir: RootDirectory = {
  id: 1,
  parentId: null,
  name: "jest-root",
  path: "/jest-root",
  root: true,
  children: [{ ...childdir }],
};

describe("Folder-tree routes testing", () => {
  describe("GET /folder-tree/root-directories", () => {
    it("should send a 200 with a list of root-directories indexed", async () => {
      const app = new App([new AuthRoute(), new FolderTreeRoute()]);
      const { authorization } = await autologin(app);

      prismaMock.directory.findRootDirectories.mockResolvedValue([rootdir]);

      const response = await request(app.getServer())
        .get("/folder-tree/root-directories")
        .set("Cookie", authorization)
        .expect(200);

      const { data } = response.body as { data: RootDirectory[] };

      expect(data.length).toBe(1);
      expect(data[0]).toMatchObject(rootdir);
    });

    it("should send a 401 when user is not logged", async () => {
      const app = new App([new AuthRoute(), new FolderTreeRoute()]);

      return request(app.getServer())
        .get("/folder-tree/root-directories")
        .expect(401);
    });
  });

  describe("GET /folder-tree/directory", () => {
    it("should send a 200 with a directory found by its id", async () => {
      const app = new App([new AuthRoute(), new FolderTreeRoute()]);
      const { authorization } = await autologin(app);

      prismaMock.directory.findById.mockResolvedValue(childdir);

      const response = await request(app.getServer())
        .get("/folder-tree/directory?id=2")
        .set("Cookie", authorization)
        .expect(200);

      const { data } = response.body as { data: ChildDirectory };

      expect(data).toMatchObject(childdir);
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
  });
});
