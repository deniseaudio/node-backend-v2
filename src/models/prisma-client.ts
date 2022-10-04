import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const MAX_SEARCH_TAKE = 15;

type PrismaUserDetails = {
  email: string;
  username: string;
  password: string;
};

type PrismaDirectoryDetails = {
  name: string;
  path: string;
  root: boolean;
  parentId: number | null;
};

type PrismaSongDetails = {
  title: string;
  length: number;
  filename: string;
  codec: string;
  path: string;
  directoryId: number | null;
  artists: { id: number }[];
  albumId: number | null;
};

type PrismaAlbumDetails = {
  name: string;
  path: string;
  artists: { id: number }[];
};

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
        select: { likes: { include: { artists: true, Album: true } } },
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
        include: {
          songs: { include: { artists: true, Album: true } },
          children: true,
        },
      });
    },

    findByPath(path: string) {
      return client.directory.findUnique({ where: { path } });
    },

    findRootDirectories() {
      return client.directory.findMany({
        where: { root: true },
        include: { children: true },
      });
    },

    create({ name, path, root, parentId }: PrismaDirectoryDetails) {
      return client.directory.create({
        data: { name, path, root, parentId },
      });
    },
  },

  song: {
    findById(id: number) {
      return client.song.findUnique({ where: { id } });
    },

    findByPath(path: string) {
      return client.song.findUnique({ where: { path } });
    },

    create(data: PrismaSongDetails) {
      return client.song.create({
        data: { ...data, artists: { connect: data.artists } },
      });
    },

    delete(id: number) {
      return client.song.delete({ where: { id } });
    },
  },

  artist: {
    findByName(name: string) {
      return client.artist.findUnique({ where: { name } });
    },

    create(data: { name: string }) {
      return client.artist.create({ data: { ...data } });
    },
  },

  album: {
    findByPath(path: string) {
      return client.album.findFirst({
        where: { path: { equals: path } },
        include: { artists: true },
      });
    },

    create(data: PrismaAlbumDetails) {
      return client.album.create({
        data: { ...data, artists: { connect: data.artists } },
      });
    },

    updateArtists(albumId: number, artists: { id: number }[]) {
      return client.album.update({
        where: { id: albumId },
        data: { artists: { connect: artists } },
      });
    },
  },

  search: {
    searchSongs(query: string) {
      return client.song.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { filename: { contains: query } },
            { artists: { some: { name: { contains: query } } } },
          ],
        },
        take: MAX_SEARCH_TAKE,
      });
    },

    searchSongsByFilename(query: string) {
      return client.song.findMany({
        where: {
          OR: [{ filename: { contains: query } }],
        },
        take: MAX_SEARCH_TAKE,
      });
    },

    searchSongsByAlbum(query: string) {
      return client.song.findMany({
        where: {
          OR: [{ Album: { name: { contains: query } } }],
        },
        take: MAX_SEARCH_TAKE,
      });
    },

    searchSongsByArtist(query: string) {
      return client.song.findMany({
        where: {
          OR: [{ artists: { some: { name: { contains: query } } } }],
        },
        take: MAX_SEARCH_TAKE,
      });
    },
  },
};
