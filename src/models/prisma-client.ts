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

    create({ email, username, password }: PrismaUserDetails) {
      return client.user.create({ data: { email, username, password } });
    },
  },
};
