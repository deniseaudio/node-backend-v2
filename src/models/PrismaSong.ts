import type { PrismaClient } from "@prisma/client";

export type PrismaSongDetails = {
  title: string;
  length: number;
  filename: string;
  codec: string;
  path: string;
  directoryId: number | null;
  artists: { id: number }[];
  albumId: number | null;
};

export class PrismaSong {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  public findByPath(path: string) {
    return this.client.song.findUnique({ where: { path } });
  }

  public create(data: PrismaSongDetails) {
    return this.client.song.create({
      data: { ...data, artists: { connect: data.artists } },
    });
  }
}
