import { playersService } from "@/services/players.service";
import { useMutation } from "@tanstack/react-query";

export function useAssignPlayerClub() {
  return useMutation({
    mutationFn: ({ playerId, clubId }: { playerId: string; clubId: string }) =>
      playersService.assignClub(playerId, clubId),
  });
}
