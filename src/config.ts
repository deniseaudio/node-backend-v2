import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const ENABLE_INDEXER = process.env.ENABLE_INDEXER === "true";
export const { NODE_ENV, PORT, SECRET_KEY, REGISTER_SECRET_KEY, ORIGIN } =
  process.env;
