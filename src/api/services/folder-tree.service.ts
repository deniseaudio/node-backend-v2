import { prismaClient } from "../../models/prisma-client";
import { mapChildrenDirectories, mapSongs } from "../utils/payload-transform";

export class FolderTreeService {
  public async getRootDirectories() {
    const rootDirectories = await prismaClient.directory.findRootDirectories();

    const transformedRootDirectories = rootDirectories.map((rootDirectory) => ({
      id: rootDirectory.id,
      name: rootDirectory.name,
      root: true,
      children: mapChildrenDirectories(rootDirectory.children),
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
      children: mapChildrenDirectories(directory.children),
      songs: mapSongs(directory.songs),
    };

    return transformedDirectories;
  }
}
