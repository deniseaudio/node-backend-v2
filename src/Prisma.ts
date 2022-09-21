import { PrismaClient } from "@prisma/client";

import { PrismaUser } from "./models/PrismaUser";
import { PrismaDirectory } from "./models/PrismaDirectory";
import { PrismaSong } from "./models/PrismaSong";
import { PrismaAlbum } from "./models/PrismaAlbum";
import { PrismaArtist } from "./models/PrismaArtist";

export class Prisma {
  public client: PrismaClient;

  public user: PrismaUser;

  public directory: PrismaDirectory;

  public song: PrismaSong;

  public album: PrismaAlbum;

  public artist: PrismaArtist;

  constructor() {
    this.client = new PrismaClient();
    this.user = new PrismaUser(this.client);
    this.directory = new PrismaDirectory(this.client);
    this.song = new PrismaSong(this.client);
    this.album = new PrismaAlbum(this.client);
    this.artist = new PrismaArtist(this.client);
  }
}

export const prismaClient = new Prisma();
