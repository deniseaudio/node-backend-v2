import fs from "node:fs";
import path from "node:path";
import type { Request, Response, NextFunction } from "express";
import { parseFile } from "music-metadata";

import type { RequestWithUser } from "../interfaces/auth.interfaces";

import { getFileContentLength } from "../utils/stream";
import { transcode } from "../utils/ffmpeg";
import { SongService } from "../services/song.service";

export class SongController {
  private readonly CACHE_FOLDER = path.join(
    process.cwd(),
    ".cache",
    "transcoded-songs"
  );

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

      // File transcoding with low-bandwidth mode.
      if (req.user.lowBandwidthEnabled) {
        const bitrate = req.user.lowBandwidthBitrate;
        const cachedSong = await this.getCachedSongStream(song.id, bitrate);

        // If the song is already cached, stream it.
        if (cachedSong) {
          res.header({
            "Content-Type": "application/octet-stream",
            "Content-Length": cachedSong.stats.size,
          });

          cachedSong.stream.pipe(res);
        }
        // If the song is not cached, transcode it and stream it.
        else {
          const transcodedSong = await this.generateCachedSongStream(
            song.codec,
            song.path,
            song.id,
            bitrate
          );

          if (transcodedSong) {
            res.header({
              "Content-Type": "application/octet-stream",
              "Content-Length": transcodedSong.stats.size,
            });

            transcodedSong.stream.pipe(res);
          } else {
            res.sendStatus(500);
          }
        }
      }
      // Pure stream mode (no transcoding).
      else {
        let readStream: fs.ReadStream | null = null;

        const { range } = req.headers;
        const { size } = getFileContentLength(song.path, range);

        res.header({
          "Content-Type": "application/octet-stream",
          "Content-Length": size,
        });

        readStream = fs.createReadStream(song.path);
        readStream.pipe(res);
      }
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

  /**
   * Given a song ID and a bitrate, return a stream of the transcoded song if
   * it exists in the cache.
   *
   * @param songId Unique song ID.
   * @param bitrate Audio bitrate in kbps.
   * @returns A read-stream and fs.stats of the cached song (or null if not found).
   */
  private getCachedSongStream = async (
    songId: number,
    bitrate: number
  ): Promise<{ stream: fs.ReadStream; stats: fs.Stats } | null> => {
    const filefolder = path.join(this.CACHE_FOLDER, songId.toString());
    const filepath = path.join(filefolder, `${bitrate}-kbps.mp3`);

    // Create the song cache folder if it doesn't exist.
    if (!fs.existsSync(filefolder)) {
      fs.mkdirSync(filefolder, { recursive: true });
    }

    // If the song is already cached, return a read-stream to it.
    if (fs.existsSync(filepath)) {
      return {
        stream: fs.createReadStream(filepath),
        stats: fs.statSync(filepath),
      };
    }

    return null;
  };

  /**
   *
   * @param codec Song codec.
   * @param sourcefile Source file path.
   * @param songId Song ID.
   * @param bitrate Audio bitrate in kbps.
   * @returns A read-stream and fs.stats of the cached song (or null if something
   * went wrong).
   */
  private generateCachedSongStream = async (
    codec: string,
    sourcefile: string,
    songId: number,
    bitrate: number
  ): Promise<{ stream: fs.ReadStream; stats: fs.Stats } | null> => {
    const filefolder = path.join(this.CACHE_FOLDER, songId.toString());
    const outputfile = path.join(filefolder, `${bitrate}-kbps.mp3`);

    // Create the song cache folder if it doesn't exist.
    if (!fs.existsSync(filefolder)) {
      fs.mkdirSync(filefolder, { recursive: true });
    }

    // Use ffmpeg to transcode the song and save it to the cache song filepath.
    const transcodedfile = await transcode(
      codec,
      sourcefile,
      outputfile,
      bitrate
    );

    // Transcoding can fail if the file codec is not supported.
    if (!transcodedfile) {
      return null;
    }

    return {
      stream: fs.createReadStream(transcodedfile),
      stats: fs.statSync(transcodedfile),
    };
  };
}
