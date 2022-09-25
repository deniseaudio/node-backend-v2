import chalk from "chalk";

import { ENABLE_INDEXER, INDEXER_ROOT_DIRECTORY } from "./config";
import { startServer } from "./api/server";
import { DBIndexer } from "./indexer/DBIndexer";
import { Walker } from "./indexer/Walker";

const LOG_PREFIX = chalk.bgMagenta.black(" IDX ");
const LOG_ERROR_PREFIX = chalk.bgRed.black(" IDX ");

(async () => {
  startServer();
})();

(async () => {
  if (ENABLE_INDEXER && INDEXER_ROOT_DIRECTORY) {
    const dbIndexer = new DBIndexer();
    const walker = new Walker({
      rootDirectory: INDEXER_ROOT_DIRECTORY,
      dbIndexer,
      filters: ["@eaDir"],
    });

    try {
      console.log(LOG_PREFIX, "Starting indexing...");
      await dbIndexer.registerRootDirectory(INDEXER_ROOT_DIRECTORY);
      await walker.walk();
      console.log(LOG_PREFIX, "Walker indexing finished.");
    } catch (error) {
      console.log(LOG_ERROR_PREFIX, JSON.stringify(error));
    }
  }
})();
