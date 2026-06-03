import { statisticsService } from "@/services/statistics.service";
import { useQuery } from "@tanstack/react-query";

export function useOverallStatistics() {
  return useQuery({
    queryKey: ["statistics", "overall"],
    queryFn: statisticsService.getOverall,
  });
}

export function useRanking() {
  return useQuery({
    queryKey: ["statistics", "ranking"],
    queryFn: statisticsService.getRanking,
  });
}
