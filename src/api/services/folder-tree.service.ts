import type { Directory, Song, Artist, Album } from "@prisma/client";

import type { CompleteSong } from "../interfaces/song.interfaces";
import { prismaClient } from "../../models/prisma-client";

export class FolderTreeService {
  public async getRootDirectories() {
    const rootDirectories = await prismaClient.directory.findRootDirectories();

    const transformedRootDirectories = rootDirectories.map((rootDirectory) => ({
      id: rootDirectory.id,
      name: rootDirectory.name,
      root: true,
      children: this.mapChildrenDirectories(rootDirectory.children),
    }));

    return transformedRootDirectories;
  }

  public async getDirectory(id: number) {
    const directory = await prismaClient.directory.findById(id);

    if (!directory) {
      return null;
    }

    const transformedDirectories = {
      id: directory.id,
      parentId: directory?.parentId || null,
      name: directory.name,
      root: directory.root,
      children: this.mapChildrenDirectories(directory.children),
      songs: this.mapDirectorySongs(directory.songs),
    };

    return transformedDirectories;
  }

  private mapChildrenDirectories(children: Directory[]) {
    return children.map((child) => ({
      id: child.id,
      parentId: child.parentId,
      name: child.name,
    }));
  }

  private mapDirectorySongs(
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
