import type { UserOptions } from "../interfaces/user.interfaces";
import { prismaClient } from "../../prisma-client";
import { mapSongs } from "../utils/payload-transform";

export class UserService {
  public async getSongsLiked(id: number) {
    const likes = await prismaClient.user.getSongsLiked(id);
    const transformedLikes = mapSongs(likes?.likes || []);

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

  public async updateUserOptions(userId: number, options: UserOptions) {
    return prismaClient.user.updateOptions(userId, {
      lowBandwidthEnabled: options.lowBandwidthEnabled,
      lowBandwidthBitrate: options.lowBandwidthBitrate,
    });
  }
}
