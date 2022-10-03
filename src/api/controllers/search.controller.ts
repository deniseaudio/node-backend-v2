import type { Request, Response, NextFunction } from "express";

import type { RequestWithUser } from "../interfaces/auth.interfaces";
import { SearchService } from "../services/search.service";

export class SearchController {
  private searchService = new SearchService();

  public getSearchedSongs = async (
    req: RequestWithUser &
      Request<
        {},
        {},
        {},
        { query: string; type: "default" | "filename" | "artist" | "album" }
      >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { query, type } = req.query;

      if (type === "default") {
        const songs = await this.searchService.getSearchedSongs(query);

        res.status(200).json({ songs });
        return;
      }

      if (type === "filename") {
        const songs = await this.searchService.getSearchedSongsByFilename(
          query
        );

        res.status(200).json({ songs });
        return;
      }

      if (type === "album") {
        const songs = await this.searchService.getSearchedSongsByAlbum(query);

        res.status(200).json({ songs });
        return;
      }

      if (type === "artist") {
        const songs = await this.searchService.getSearchedSongsByArtist(query);

        res.status(200).json({ songs });
        return;
      }

      res.status(200).json({ songs: [] });
    } catch (error) {
      next(error);
    }
  };
}
