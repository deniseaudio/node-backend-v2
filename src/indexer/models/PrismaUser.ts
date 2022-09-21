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

  public findByEmail(email: string) {
    return this.client.user.findUnique({ where: { email } });
  }

  public findById(id: number) {
    return this.client.user.findUnique({ where: { id } });
  }

  public create({ email, username, password }: PrismaUserDetails) {
    return this.client.user.create({ data: { email, username, password } });
  }

  public delete(id: number) {
    return this.client.user.delete({ where: { id } });
  }
}
