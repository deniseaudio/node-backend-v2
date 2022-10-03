import { prismaClient } from "../../models/prisma-client";

export class UserService {
  public async getSongsLiked(id: number) {
    const likes = await prismaClient.user.getSongsLiked(id);

    return likes;
  }

  public async toggleSongLike(userId: number, songId: number) {
    const likes = await this.getSongsLiked(userId);

    if (likes) {
      const hasLike = likes.likes.some((like) => like.id === songId);

      await (!hasLike
        ? prismaClient.user.createSongLike(userId, songId)
        : prismaClient.user.deleteSongLike(userId, songId));
    }

    const updatedLikes = await this.getSongsLiked(userId);

    return updatedLikes;
  }
}
