import type { User, Song } from "@prisma/client";
import request from "supertest";

import { prismaMock } from "../test-utils/jest-prisma-singleton";
import { autologin } from "../test-utils/jest-autologin";
import { App } from "../api/App";
import { AuthRoute } from "../api/routes/auth.routes";
import { UserRoute } from "../api/routes/user.routes";

const user: User = {
  id: 1,
  email: "test@jest.com",
  username: "jest-test",
  password: "jest-password",
  lowBandwidthEnabled: true,
  lowBandwidthBitrate: 128,
};

const likes: Song[] = [
  {
    albumId: 1,
    directoryId: 1,
    userId: 1,
    id: 1,
    path: "/jest-root/song.mp3",
    filename: "song.mp3",
    title: "jest-song",
    codec: "MP3",
    length: 365,
  },
];

describe("User routes testing", () => {
  describe("GET /user/songs-liked", () => {
    it("should send a 200 with a list of songs liked by a specific user", async () => {
      const like = {
        id: 1,
        userId: 1,
        directoryId: 1,
        albumId: 1,
        Album: { id: 1, name: "My Album", path: "/jest-root/my-album" },
        artists: [{ id: 1, name: "My Artist" }],
        title: "jest-song",
        filename: "song.mp3",
        path: "/jest-root/song.mp3",
        codec: "MP3",
        length: 365,
      };

      const app = new App([new AuthRoute(), new UserRoute()]);
      const { authorization } = await autologin(app);

      // Mock the entire Prisma object response.
      prismaMock.user.getSongsLiked.mockResolvedValue({ likes: [like] });

      const response = await request(app.getServer())
        .get("/user/songs-liked")
        .set("Cookie", authorization)
        .expect(200);

      // Make sure the response is edited and doesn't send the whole Prisma
      // payload because we filter some values to send to the client.
      expect(response.body.data).toMatchObject([
        {
          id: like.id,
          directoryId: like.directoryId,
          title: like.title,
          artists: like.artists.map((artist) => ({
            id: artist.id,
            name: artist.name,
          })),
          album: { id: like.Album.id, name: like.Album.name },
          filename: like.filename,
          length: like.length,
          codec: like.codec,
        },
      ]);
    });

    it("should send a 401 when user is not logged", async () => {
      const app = new App([new AuthRoute(), new UserRoute()]);

      return request(app.getServer()).get("/user/songs-liked").expect(401);
    });

    it("should send a 500 if the controller throws an error", async () => {
      const app = new App([new AuthRoute(), new UserRoute()]);
      const { authorization } = await autologin(app);

      // Mock Prisma error rejection that should be handled inside the controller.
      prismaMock.user.getSongsLiked.mockImplementation(() => {
        throw new Error("Mocked error");
      });

      return request(app.getServer())
        .get("/user/songs-liked")
        .set("Cookie", authorization)
        .expect(500);
    });
  });

  describe("POST /user/toggle-song-like", () => {
    it("should send a 200 and toggle a song like", async () => {
      const like = {
        id: 1,
        userId: 1,
        directoryId: 1,
        albumId: 1,
        Album: { id: 1, name: "My Album", path: "/jest-root/my-album" },
        artists: [{ id: 1, name: "My Artist" }],
        title: "jest-song",
        filename: "song.mp3",
        path: "/jest-root/song.mp3",
        codec: "MP3",
        length: 365,
      };

      const app = new App([new AuthRoute(), new UserRoute()]);
      const { authorization } = await autologin(app);

      // Mock the entire Prisma object response.
      prismaMock.user.getSongsLiked.mockResolvedValue({ likes: [like] });

      const response = await request(app.getServer())
        .post(`/user/toggle-song-like?id=${likes[0].id}`)
        .set("Cookie", authorization)
        .expect(200);

      // Make sure the response is edited and doesn't send the whole Prisma
      // payload because we filter some values to send to the client.
      expect(response.body.data).toMatchObject([
        {
          id: like.id,
          directoryId: like.directoryId,
          title: like.title,
          artists: like.artists.map((artist) => ({
            id: artist.id,
            name: artist.name,
          })),
          album: { id: like.Album.id, name: like.Album.name },
          filename: like.filename,
          length: like.length,
          codec: like.codec,
        },
      ]);
    });

    it("should send a 401 when user is not logged", async () => {
      const app = new App([new AuthRoute(), new UserRoute()]);

      return request(app.getServer())
        .post("/user/toggle-song-like?id=1")
        .expect(401);
    });

    it("should send a 500 if the controller throws an error", async () => {
      const app = new App([new AuthRoute(), new UserRoute()]);
      const { authorization } = await autologin(app);

      // Mock Prisma error rejection that should be handled inside the controller.
      prismaMock.user.createSongLike.mockImplementation(() => {
        throw new Error("Mocked error");
      });

      return request(app.getServer())
        .post("/user/toggle-song-like?id=1")
        .set("Cookie", authorization)
        .expect(500);
    });
  });

  describe("POST /user/update-options", () => {
    it("should send a 200 when updating user options", async () => {
      const app = new App([new AuthRoute(), new UserRoute()]);
      const { authorization } = await autologin(app);

      prismaMock.user.updateOptions.mockResolvedValue(user);

      return request(app.getServer())
        .post("/user/update-options")
        .send({ lowBandwidthEnabled: false, lowBandwidthBitrate: 192 })
        .set("Cookie", authorization)
        .expect(200);
    });

    it("should send a 400 when updating user with invalid options", async () => {
      const app = new App([new AuthRoute(), new UserRoute()]);
      const { authorization } = await autologin(app);

      prismaMock.user.updateOptions.mockResolvedValue(user);

      return request(app.getServer())
        .post("/user/update-options")
        .send({ lowBandwidthEnabled: false, lowBandwidthBitrate: 1 })
        .set("Cookie", authorization)
        .expect(400);
    });
  });
});
