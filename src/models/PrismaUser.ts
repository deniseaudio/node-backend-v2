import type { PrismaClient } from "@prisma/client";

export type PrismaUserDetails = {
  email: string;
  username: string;
  password: string;
};

export class PrismaUser {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  public delete(id: number) {
    return this.client.user.delete({ where: { id } });
  }
}
