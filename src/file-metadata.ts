import { parseFile } from "music-metadata";

export type FileMetadata = {
  title: string;
  artist: string;
  album: string;
  codec: string;
  length: number;
};

export const extractFileMetadata = async (
  filepath: string
): Promise<FileMetadata> => {
  const fileMetadata: FileMetadata = {
    title: "Unknown",
    artist: "Unknown",
    album: "Unknown",
    codec: "Unknown",
    length: -1,
  };

  try {
    const metadata = await parseFile(filepath);

    if (metadata.common) {
      if (metadata.common.title) {
        fileMetadata.title = metadata.common.title;
      }

      if (metadata.common.artist) {
        fileMetadata.artist = metadata.common.artist;
      }

      if (metadata.common.album) {
        fileMetadata.album = metadata.common.album;
      }
    }

    if (metadata.format) {
      if (metadata.format.codec) {
        fileMetadata.codec = metadata.format.codec;
      }

      if (metadata.format.duration) {
        fileMetadata.length = metadata.format.duration;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return fileMetadata;
};
