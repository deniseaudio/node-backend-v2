import { prismaClient } from "../../models/Prisma";

export class FolderTreeService {
  public async getRootDirectories() {
    const directories = await prismaClient.directory.findRootDirectories();

    return directories;
  }

  public async getDirectory(id: number) {
    const directory = await prismaClient.directory.findById(id);

    return directory;
  }
}
