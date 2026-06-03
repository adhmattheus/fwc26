import { teamsService } from "@/services/teams.service";
import { useQuery } from "@tanstack/react-query";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: teamsService.getAll,
  });
}

export function useTeamBySlug(slug: string) {
  return useQuery({
    queryKey: ["teams", slug],
    queryFn: () => teamsService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useTeamById(id: string) {
  return useQuery({
    queryKey: ["teams", id],
    queryFn: () => teamsService.getById(id),
    enabled: !!id,
  });
}
