export const SIZES = {
  BADGE: {
    SMALL: { width: 6, height: 6 },
    MEDIUM: { width: 14, height: 14 },
    LARGE: { width: 16, height: 16 },
    EXTRA_LARGE: { width: 32, height: 32 },
  },
  BANNER: {
    SMALL: "h-20",
    MEDIUM: "h-24",
  },
} as const;

export const ASSETS = {
  STICKERLAB_URL:
    "https://dvcammctw5or7.cloudfront.net/team-badges/stickerlab.png",
} as const;

export const ACCURACY_THRESHOLDS = {
  PERFECT: 100,
  GOOD: 80,
} as const;

export const ROUTES = {
  HOME: "/",
  TEAM: (id: string) => `/team/${id}`,
} as const;

export const STATUS_LABELS = {
  IN_ALBUM_AND_CALLED_UP: "In album and called up",
  ONLY_IN_ALBUM: "Only in album",
  CALLED_UP_WITHOUT_STICKER: "Called up without sticker",
} as const;
