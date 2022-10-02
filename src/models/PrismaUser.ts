import type { PrismaClient } from "@prisma/client";

export type PrismaUserDetails = {
  email: string;
  username: string;
  password: string;
};

export class PrismaUser {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  public getSongsLiked(id: number) {
    return this.client.user.findUnique({
      where: { id },
      select: { likes: true },
    });
  }

  public createSongLike(userId: number, songId: number) {
    return this.client.user.update({
      where: { id: userId },
      data: { likes: { connect: { id: songId } } },
    });
  }

  public delete(id: number) {
    return this.client.user.delete({ where: { id } });
  }

  public deleteSongLike(userId: number, songId: number) {
    return this.client.user.update({
      where: { id: userId },
      data: { likes: { disconnect: { id: songId } } },
    });
  }
}
