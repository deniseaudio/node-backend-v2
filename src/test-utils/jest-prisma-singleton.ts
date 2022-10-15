/* eslint import/no-extraneous-dependencies: "off" */
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import { prismaClient } from "../prisma-client";

// Mock deep objects and functions in `prismaClient` object.
// Those functions will not call anymore `@prisma/client`.
jest.mock("../prisma-client", () => ({
  __esModule: true,
  prismaClient: mockDeep<typeof prismaClient>(),
}));

// Export the mock interface to use when applying resolved and rejected values
// inside our test files.
export const prismaMock = prismaClient as unknown as DeepMockProxy<
  typeof prismaClient
>;

// Reset the mock implementations before each test.
beforeEach(() => {
  mockReset(prismaMock);
});
