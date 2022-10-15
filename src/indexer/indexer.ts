import { INDEXER_ROOT_DIRECTORY } from "../config";
import { DBIndexer } from "./DBIndexer";
import { Walker } from "./Walker";

if (!INDEXER_ROOT_DIRECTORY) {
  throw new Error("INDEXER_ROOT_DIRECTORY is not defined.");
}

// DBIndexer is responsible for registering directories and songs in the database.
export const dbIndexer = new DBIndexer(INDEXER_ROOT_DIRECTORY);

// Walker is responsible for traversing the filesystem.
// It will use the DBIndexer to register directories and songs in the database.
export const walker = new Walker({
  dbIndexer,
  rootDirectory: INDEXER_ROOT_DIRECTORY,
  filters: ["@eaDir"],
});
