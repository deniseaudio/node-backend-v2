import type { PrismaClient } from "@prisma/client";

export type PrismaAlbumDetails = {
  name: string;
  artistId: number | null;
};

export class PrismaAlbum {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  public findByArtistIdAndName(artistId: number | null, name: string) {
    return this.client.album.findFirst({
      where: { artistId: { equals: artistId }, name: { equals: name } },
    });
  }

  public create(data: PrismaAlbumDetails) {
    return this.client.album.create({ data: { ...data } });
  }
}
