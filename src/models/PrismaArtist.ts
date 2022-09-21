import type { PrismaClient } from "@prisma/client";

export type PrismaArtistDetails = {
  name: string;
};

export class PrismaArtist {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  public findByName(name: string) {
    return this.client.artist.findUnique({ where: { name } });
  }

  public create(data: PrismaArtistDetails) {
    return this.client.artist.create({ data: { ...data } });
  }
}
