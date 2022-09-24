import type { PrismaClient } from "@prisma/client";

export type PrismaAlbumDetails = {
  name: string;
  path: string;
  artists: { id: number }[];
};

export class PrismaAlbum {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  public findByPath(path: string) {
    return this.client.album.findFirst({
      where: { path: { equals: path } },
      include: { artists: true },
    });
  }

  public create(data: PrismaAlbumDetails) {
    return this.client.album.create({
      data: { ...data, artists: { connect: data.artists } },
    });
  }

  public updateArtists(albumId: number, artists: { id: number }[]) {
    return this.client.album.update({
      where: { id: albumId },
      data: { artists: { connect: artists } },
    });
  }
}
