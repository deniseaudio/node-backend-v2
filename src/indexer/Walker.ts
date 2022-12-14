import path from "node:path";
import chalk from "chalk";
import walk, {
  type Walker as WalkWalker,
  type WalkStats,
  type WalkNext,
} from "walk";

import type { DBIndexer } from "./DBIndexer";
import { extractFileMetadata } from "./utils/extract-file-metadata";

const LOG_PREFIX = chalk.bgGreen.black(" WLK ");

export type WalkerOptions = {
  dbIndexer: DBIndexer;
  rootDirectory: string;
  extensions?: string[];
  filters?: string[];
};

export class Walker {
  private dbIndexer: DBIndexer;

  private rootDirectory: string;

  private extensions: string[];

  private filters: string[];

  private walker: WalkWalker | null;

  public isIndexing: boolean;

  constructor(options: WalkerOptions) {
    this.dbIndexer = options.dbIndexer;
    this.rootDirectory = path.normalize(options.rootDirectory);
    this.extensions = options.extensions || [".mp3", ".wav", ".flac", ".m4a"];
    this.filters = options.filters || [];
    this.walker = null;
    this.isIndexing = false;
  }

  private async directoryListener(
    base: string,
    dir: WalkStats,
    next: WalkNext
  ): Promise<void> {
    // Don't register directories if their name contains a key in the `filters` array.
    if (this.filters.some((filter) => filter.includes(dir.name))) {
      next();
    } else {
      await this.dbIndexer.handleDirectory(dir, base);
      next();
    }
  }

  private async fileListener(
    base: string,
    file: WalkStats,
    next: WalkNext
  ): Promise<void> {
    if (this.extensions.includes(path.extname(file.name))) {
      const metadata = await extractFileMetadata(`${base}/${file.name}`);
      await this.dbIndexer.handleSong(file, base, metadata);
    }

    next();
  }

  private endListener(): void {
    console.log(LOG_PREFIX, "Finished traversing directories.");

    this.walker = null;
    this.isIndexing = false;
  }

  public walk(): Promise<void> {
    this.stop();

    console.log(LOG_PREFIX, "Starting walker directory traverser.");

    this.isIndexing = true;

    this.walker = walk.walk(this.rootDirectory, {
      followLinks: false,
      filters: this.filters,
      listeners: {
        directory: this.directoryListener.bind(this),
        file: this.fileListener.bind(this),
        end: this.endListener.bind(this),
      },
    });

    return new Promise((resolve, reject) => {
      if (this.walker) {
        this.walker.on("end", () => resolve());
      } else {
        reject(new Error("No Walker instance, internal error."));
      }
    });
  }

  public stop() {
    if (this.walker) {
      this.walker.pause();
      this.walker = null;
      this.isIndexing = false;

      console.log(
        LOG_PREFIX,
        "Walker stopped. There may be pending requests to the database."
      );
    }
  }
}
