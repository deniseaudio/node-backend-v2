import type { PrismaClient } from "@prisma/client";

export type PrismaDirectoryDetails = {
  name: string;
  path: string;
  root: boolean;
  parentId: number | null;
};

export class PrismaDirectory {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  public findByPath(path: string) {
    return this.client.directory.findUnique({ where: { path } });
  }

  public findRootDirectories() {
    return this.client.directory.findMany({ where: { root: true } });
  }

  public create({ name, path, root, parentId }: PrismaDirectoryDetails) {
    return this.client.directory.create({
      data: { name, path, root, parentId },
    });
  }
}
