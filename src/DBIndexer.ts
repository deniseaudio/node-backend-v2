import path from "node:path";
import chalk from "chalk";
import type { WalkStats } from "walk";

import type { FileMetadata } from "./file-metadata";
import { prismaClient } from "./Prisma";

const LOG_PREFIX = chalk.bgCyan.black(" DBI ");

export class DBIndexer {
  public async registerRootDirectory(basepath: string): Promise<void> {
    const exists = await prismaClient.directory.findByPath(basepath);
    const dirname = path.basename(basepath);

    if (!exists) {
      await prismaClient.directory.create({
        name: dirname,
        path: basepath,
        root: true,
        parentId: null,
      });
    }

    console.log(
      LOG_PREFIX,
      `${!exists ? chalk.green("+") : chalk.gray("|")} Root ${dirname}`
    );
  }

  public async handleDirectory(
    dir: WalkStats,
    basepath: string
  ): Promise<void> {
    const dirpath = `${basepath}/${dir.name}`;
    const exists = await prismaClient.directory.findByPath(dirpath);

    if (!exists) {
      const parent = await prismaClient.directory.findByPath(basepath);
      const parentId = parent ? parent.id : null;

      await prismaClient.directory.create({
        name: dir.name,
        path: dirpath,
        root: false,
        parentId,
      });
    }

    console.log(
      LOG_PREFIX,
      `${!exists ? chalk.green("+") : chalk.gray("|")} ${dir.name}`
    );
  }

  public async handleSong(
    file: WalkStats,
    basepath: string,
    metadata: FileMetadata
  ): Promise<void> {
    const filepath = `${basepath}/${file.name}`;
    const exists = await prismaClient.song.findByPath(filepath);

    if (!exists) {
      const parent = await prismaClient.directory.findByPath(basepath);
      const artist = await this.getSongArtist(metadata.artist);
      const album = await this.getAlbumArtist(artist.id, metadata.album);

      await prismaClient.song.create({
        codec: metadata.codec,
        filename: file.name,
        length: metadata.length,
        path: filepath,
        title: metadata.title,
        artistId: artist ? artist.id : null,
        albumId: album ? album.id : null,
        directoryId: parent ? parent.id : null,
      });
    }

    console.log(
      LOG_PREFIX,
      `${!exists ? chalk.green("+") : chalk.gray("|")} ${file.name}`
    );
  }

  private async getSongArtist(name: string) {
    const exists = await prismaClient.artist.findByName(name);

    if (!exists) {
      return prismaClient.artist.create({ name });
    }

    return exists;
  }

  private async getAlbumArtist(artistId: number, albumName: string) {
    const exists = await prismaClient.album.findByArtistIdAndName(
      artistId,
      albumName
    );

    if (!exists) {
      return prismaClient.album.create({ name: albumName, artistId });
    }

    return exists;
  }
}
