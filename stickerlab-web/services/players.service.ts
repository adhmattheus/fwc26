import type { PlayerResponse } from "@/services/teams.service";
import { api } from "./api";

export const playersService = {
  getByTeam: (teamId: string) =>
    api.get<PlayerResponse[]>(`/players?team_id=${teamId}`),

  assignClub: (playerId: string, clubId: string) =>
    api.patch<PlayerResponse>(`/players/${playerId}/club`, { clubId }),
};
