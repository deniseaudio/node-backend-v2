export type UserData = {
  email: string;
  username: string;
  password: string;
  secretKey: string;
};

export type UserOptions = {
  lowBandwidthEnabled: boolean;
  lowBandwidthBitrate: number;
};

export type User = UserOptions & {
  id: number;
  email: string;
  password: string;
};
