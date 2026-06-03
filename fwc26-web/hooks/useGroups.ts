import { groupsService } from "@/services/groups.service";
import { useQuery } from "@tanstack/react-query";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: groupsService.getAll,
  });
}
