export type CompleteSong = {
  id: number;
  directoryId: number | null;
  title: string;
  artists: { id: number; name: string }[];
  album: { id: number; name: string } | null;
  filename: string;
  length: number;
  codec: string;
};
