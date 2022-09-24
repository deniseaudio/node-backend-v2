import fs from "node:fs";
import type { Request, Response, NextFunction } from "express";
import { parseFile } from "music-metadata";

import type { RequestWithUser } from "../interfaces/auth.interfaces";

import { getFileContentLength } from "../utils/stream";
import { SongService } from "../services/song.service";

export class SongController {
  private songService = new SongService();

  public getSongStream = async (
    req: RequestWithUser & Request<{}, {}, {}, { id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.query;
      const song = await this.songService.getSong(id);

      if (!song) {
        res
          .status(404)
          .send({ message: "getSongStream", error: "No song found" });
        return;
      }

      // If the song is referenced in DB but not found in system, delete it
      // from the DB.
      if (!fs.existsSync(song.path)) {
        await this.songService.deleteSong(id);

        res.status(404).send({
          message: "getSongStream",
          error: "File not found but is still indexed in database",
        });
        return;
      }

      let readStream: fs.ReadStream | null = null;

      const { range } = req.headers;
      const { size } = getFileContentLength(song.path, range);

      res.header({
        "Content-Type": "application/octet-stream",
        "Content-Length": size,
      });

      readStream = fs.createReadStream(song.path);
      readStream.pipe(res);
    } catch (error) {
      next(error);
    }
  };

  public getSongCover = async (
    req: RequestWithUser & Request<{}, {}, {}, { id: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.query;
      const song = await this.songService.getSong(id);

      if (!song) {
        res
          .status(404)
          .send({ message: "getSongCover", error: "No song found" });
        return;
      }

      // If the song is referenced in DB but not found in system, delete it
      // from the DB.
      if (!fs.existsSync(song.path)) {
        await this.songService.deleteSong(id);

        res.status(404).send({
          message: "getSongCover",
          error: "File not found but is still indexed in database",
        });
        return;
      }

      const metadata = await parseFile(song.path);

      if (!metadata.common.picture || metadata.common.picture.length === 0) {
        res
          .status(404)
          .send({ message: "getSongCover", error: "No cover inside metadata" });
        return;
      }

      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.write(Buffer.from(metadata.common.picture[0].data), (err) => {
        if (err) {
          res.end();
          res.sendStatus(500);
          return;
        }

        res.end();
      });
    } catch (error) {
      next(error);
    }
  };
}
