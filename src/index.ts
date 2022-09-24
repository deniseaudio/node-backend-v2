import path from "node:path";
import chalk from "chalk";

import { ENABLE_INDEXER } from "./config";
import { startServer } from "./api/server";
import { DBIndexer } from "./indexer/DBIndexer";
import { Walker } from "./indexer/Walker";

const LOG_PREFIX = chalk.bgMagenta.black(" IDX ");
const LOG_ERROR_PREFIX = chalk.bgRed.black(" IDX ");
const rootDirectory = path.join(process.cwd(), "songs");

const dbIndexer = new DBIndexer();
const walker = new Walker({ rootDirectory, dbIndexer, filters: ["@eaDir"] });

(async () => {
  startServer();
})();

(async () => {
  if (ENABLE_INDEXER) {
    try {
      console.log(LOG_PREFIX, "Starting indexing...");
      await dbIndexer.registerRootDirectory(rootDirectory);
      await walker.walk();
      console.log(LOG_PREFIX, "Walker indexing finished.");
    } catch (error) {
      console.log(LOG_ERROR_PREFIX, JSON.stringify(error));
    }
  }
})();
