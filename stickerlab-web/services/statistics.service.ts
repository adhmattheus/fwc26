import { api } from "./api";
import type { TeamResponse } from "./teams.service";

export interface MostRepresentedClub {
  club: string;
  percentage: number;
  playerCount: number;
  totalPlayers: number;
}

export interface OverallStatisticsResponse {
  totalTeams: number;
  totalAlbumPlayers: number;
  totalCalledUpPlayers: number;
  totalInAlbumAndCalledUp: number;
  totalOnlyInAlbum: number;
  totalCalledUpWithoutSticker: number;
  paniniAccuracyRate: number;
  errorRate: number;
  mostRepresentedClub: MostRepresentedClub | null;
}

export interface RankingItemResponse {
  rank: number;
  team: TeamResponse;
  statistics: {
    paniniAccuracyRate: number;
    errorRate: number;
  };
}

export const statisticsService = {
  getOverall: () => api.get<OverallStatisticsResponse>("/statistics/overall"),
  getRanking: () => api.get<RankingItemResponse[]>("/statistics/ranking"),
};
