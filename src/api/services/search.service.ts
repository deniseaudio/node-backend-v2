import { prismaClient } from "../../models/prisma-client";

export class SearchService {
  public async getSearchedSongs(query: string) {
    const songs = await prismaClient.search.searchSongs(query);

    return songs;
  }

  public async getSearchedSongsByFilename(query: string) {
    const songs = await prismaClient.search.searchSongsByFilename(query);

    return songs;
  }

  public async getSearchedSongsByAlbum(query: string) {
    const songs = await prismaClient.search.searchSongsByAlbum(query);

    return songs;
  }

  public async getSearchedSongsByArtist(query: string) {
    const songs = await prismaClient.search.searchSongsByArtist(query);

    return songs;
  }
}
