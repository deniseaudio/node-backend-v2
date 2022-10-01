import { PrismaClient } from "@prisma/client";

import { PrismaUserDetails } from "./PrismaUser";

const client = new PrismaClient();

export const prismaClient = {
  user: {
    findByEmail(email: string) {
      return client.user.findUnique({ where: { email } });
    },

    create({ email, username, password }: PrismaUserDetails) {
      return client.user.create({ data: { email, username, password } });
    },
  },
};
