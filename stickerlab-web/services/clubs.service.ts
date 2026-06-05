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

export const clubsService = {
  getAll: () => api.get<ClubsResponse>("/clubs").then((res) => res.data ?? []),
};
