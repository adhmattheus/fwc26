import { api } from "./api";

interface ClubsResponse {
  total: number;
  data: ClubResponse[];
}

export interface ClubResponse {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  badgeUrl: string | null;
  createdAt: string;
  updatedAt: string;
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

export const clubsService = {
  getAll: () => api.get<ClubsResponse>("/clubs").then((res) => res.data ?? []),
  getRanking: () => api.get<ClubRankingItem[]>("/clubs/ranking"),
};
