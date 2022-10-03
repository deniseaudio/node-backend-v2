import { PrismaClient } from "@prisma/client";

import { PrismaUserDetails } from "./PrismaUser";

const client = new PrismaClient();

export const prismaClient = {
  user: {
    findById(id: number) {
      return client.user.findUnique({ where: { id } });
    },

    findByEmail(email: string) {
      return client.user.findUnique({ where: { email } });
    },

    getSongsLiked(id: number) {
      return client.user.findUnique({
        where: { id },
        select: { likes: true },
      });
    },

    create({ email, username, password }: PrismaUserDetails) {
      return client.user.create({ data: { email, username, password } });
    },

    createSongLike(userId: number, songId: number) {
      return client.user.update({
        where: { id: userId },
        data: { likes: { connect: { id: songId } } },
        select: { likes: true },
      });
    },

    deleteSongLike(userId: number, songId: number) {
      return client.user.update({
        where: { id: userId },
        data: { likes: { disconnect: { id: songId } } },
        select: { likes: true },
      });
    },
  },

  directory: {
    findById(id: number) {
      return client.directory.findUnique({
        where: { id },
        include: { songs: true, children: true },
      });
    },

    findRootDirectories() {
      return client.directory.findMany({
        where: { root: true },
        include: { children: true },
      });
    },
  },

  song: {
    findById(id: number) {
      return client.song.findUnique({ where: { id } });
    },

    delete(id: number) {
      return client.song.delete({ where: { id } });
    },
  },
};
