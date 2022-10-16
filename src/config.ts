import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const ENABLE_INDEXER_ON_BOOT =
  process.env.ENABLE_INDEXER_ON_BOOT === "true";

export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  REGISTER_SECRET_KEY,
  ORIGIN,
  INDEXER_ROOT_DIRECTORY,
} = process.env;
