import { api } from "@/services/api";
import type { ClubResponse } from "@/services/clubs.service";
import { useQuery } from "@tanstack/react-query";

interface ClubsApiResponse {
  total: number;
  data: ClubResponse[];
}

export function useClubs() {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: () => api.get<ClubsApiResponse>("/clubs"),
    select: (res): ClubResponse[] =>
      Array.isArray(res) ? res : (res.data ?? []),
    staleTime: 1000 * 60 * 60,
  });
}
