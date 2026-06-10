"use server";

import { apiServer } from "@/services/api.server";
import type { PlayerResponse } from "@/services/teams.service";

export async function assignPlayerClubAction(
  playerId: string,
  clubId: string,
): Promise<PlayerResponse> {
  return apiServer.patch<PlayerResponse>(`/players/${playerId}/club`, { clubId });
}
