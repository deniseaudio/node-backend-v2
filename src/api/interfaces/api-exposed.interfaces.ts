/**
 * Exposed API user payload.
 */
export type APIExposedUser = {
  id: number;
  username: string;
  email: string;
  likes: APIExposedSong[];
  lowBandwidthEnabled: boolean;
  lowBandwidthBitrate: number;
};

/**
 * Exposed API child directory payload.
 */
export type APIExposedChildDirectory = {
  id: number;
  parentId: number | null;
  name: string;
};

/**
 * Exposed API song payload.
 */
export type APIExposedSong = {
  id: number;
  directoryId: number | null;
  title: string;
  artists: { id: number; name: string }[];
  album: { id: number; name: string } | null;
  filename: string;
  length: number;
  codec: string;
};
