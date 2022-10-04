import type { Song, Artist, Album } from "@prisma/client";

import type { CompleteSong } from "../interfaces/song.interfaces";
import { prismaClient } from "../../models/prisma-client";

export class UserService {
  public async getSongsLiked(id: number) {
    const likes = await prismaClient.user.getSongsLiked(id);
    const transformedLikes = this.mapSongsLikes(likes?.likes || []);

    return transformedLikes;
  }

  public async toggleSongLike(userId: number, songId: number) {
    const likes = await prismaClient.user.getSongsLiked(userId);

    if (likes) {
      const hasLike = likes.likes.some((like) => like.id === songId);

      await (!hasLike
        ? prismaClient.user.createSongLike(userId, songId)
        : prismaClient.user.deleteSongLike(userId, songId));
    }

    return this.getSongsLiked(userId);
  }

  private mapSongsLikes(
    songs: (Song & { artists: Artist[]; Album: Album | null })[]
  ): CompleteSong[] {
    return songs.map((song) => ({
      id: song.id,
      directoryId: song.directoryId,
      title: song.title,
      artists: song.artists,
      album: song.Album
        ? {
            id: song.Album.id,
            name: song.Album.name,
          }
        : null,
      filename: song.filename,
      length: song.length,
      codec: song.codec,
    }));
  }
}
