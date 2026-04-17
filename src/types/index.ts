export type PermissionString = keyof typeof import('../utils/permissions.js').permissions;

export enum ChannelType {
  Text = 0,
  Voice = 1,
  Category = 2,
}

export enum MessageType {
  Default = 0,
  System = 1,
  Pinned = 2,
  Unpinned = 3,
}

export interface PermissionOverwrite {
  id: string;
  type: 'role' | 'member';
  allow: bigint;
  deny: bigint;
}

export interface Embed {
  title?: string;
  description?: string;
  color?: number;
  url?: string;
  timestamp?: string;
  footer?: { text: string; icon_url?: string };
  image?: { url: string };
  thumbnail?: { url: string };
  author?: { name: string; icon_url?: string; url?: string };
  fields?: { name: string; value: string; inline?: boolean }[];
}