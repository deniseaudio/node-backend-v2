import { prismaClient } from "../../prisma-client";

export class SongService {
  public async getSong(id: number) {
    const song = await prismaClient.song.findById(id);

    return song;
  }

  public async deleteSong(id: number) {
    const song = await prismaClient.song.delete(id);

    return song;
  }
}
