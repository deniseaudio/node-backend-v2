import type { Directory, Song, Artist, Album, User } from "@prisma/client";

import {
  APIExposedUser,
  APIExposedChildDirectory,
  APIExposedSong,
} from "../interfaces/api-exposed.interfaces";

/**
 * Universal payload transformer for directory-related payloads.
 *
 * @param children Prisma Directory array.
 * @returns Formatted children directories.
 */
export const mapChildrenDirectories = (
  children: Directory[]
): APIExposedChildDirectory[] => {
  return children.map((child) => ({
    id: child.id,
    parentId: child.parentId,
    name: child.name,
  }));
};

/**
 * Universal payload transformer for song-related payloads.
 *
 * @param songs Prisma Song with Artists and Album included.
 * @returns Formatted songs.
 */
export const mapSongs = (
  songs: (Song & { artists: Artist[]; Album: Album | null })[]
): APIExposedSong[] => {
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
};

/**
 * Universal payload transformer for user-related payloads.
 *
 * @param user Prisma User.
 * @param songs Prisma Song, should match `mapSongs` parameter.
 * @returns Formatted user.
 */
export const mapUser = (
  user: User,
  likes: (Song & { artists: Artist[]; Album: Album | null })[]
): APIExposedUser => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    likes: mapSongs(likes),
    lowBandwidthEnabled: user.lowBandwidthEnabled,
    lowBandwidthBitrate: user.lowBandwidthBitrate,
  };
};
