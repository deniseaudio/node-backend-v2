import { prismaClient } from "../../models/Prisma";

export class FolderTreeService {
  public async getRootDirectories() {
    const directories = await prismaClient.directory.findRootDirectories();

    return directories;
  }
}
