import chalk from "chalk";

import { ENABLE_INDEXER_ON_BOOT } from "./config";
import { startServer } from "./api/server";
import { dbIndexer, walker } from "./indexer/indexer";

const LOG_PREFIX = chalk.bgMagenta.black(" IDX ");
const LOG_ERROR_PREFIX = chalk.bgRed.black(" IDX ");

(async () => {
  startServer();
})();

(async () => {
  if (ENABLE_INDEXER_ON_BOOT) {
    try {
      console.log(LOG_PREFIX, "Starting indexing...");
      await dbIndexer.registerRootDirectory();
      await walker.walk();
      console.log(LOG_PREFIX, "Walker indexing finished.");
    } catch (error) {
      console.log(LOG_ERROR_PREFIX, JSON.stringify(error));
    }
  }
})();
