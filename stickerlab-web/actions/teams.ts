"use server";

import { apiServer } from "@/services/api.server";
import type { TeamResponse } from "@/services/teams.service";

export async function uploadTeamBadgeAction(
  teamId: string,
  formData: FormData,
): Promise<TeamResponse> {
  return apiServer.upload<TeamResponse>(`/teams/${teamId}/upload-badge`, formData);
}
