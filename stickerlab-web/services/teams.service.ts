import { api } from "./api";

export interface TeamResponse {
  id: string;
  name: string;
  slug: string;
  fifaCode: string;
  badgeUrl: string | null;
  colorPrimary: string;
  colorSecondary: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerResponse {
  id: string;
  name: string;
  canonicalName: string;
  albumCode: string | null;
  inAlbum: boolean;
  calledUp: boolean;
  teamId: string;
}

export interface TeamDetailResponse {
  team: TeamResponse;
  players: {
    album: PlayerResponse[];
    calledUp: PlayerResponse[];
  };
  comparison: {
    inAlbumAndCalledUp: { total: number; players: PlayerResponse[] };
    onlyInAlbum: { total: number; players: PlayerResponse[] };
    calledUpWithoutSticker: { total: number; players: PlayerResponse[] };
  };
  statistics: {
    paniniAccuracyRate: number;
    errorRate: number;
  };
}

export interface TeamWithStats extends TeamResponse {
  comparison?: {
    inAlbumAndCalledUp: number;
    onlyInAlbum: number;
    calledUpWithoutSticker: number;
  };
}

export const teamsService = {
  getAll: () => api.get<TeamResponse[]>("/teams"),
  getBySlug: (slug: string) => api.get<TeamDetailResponse>(`/teams/${slug}`),
  getById: (id: string) => api.get<TeamDetailResponse>(`/teams/${id}`),
};
