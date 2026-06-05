export interface Club {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  badgeUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClubRankingItem {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  badgeUrl: string | null;
  playerCount: number;
  percentage: number;
}
