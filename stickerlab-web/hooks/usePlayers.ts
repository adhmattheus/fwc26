import { assignPlayerClubAction } from "@/actions/players";
import { useMutation } from "@tanstack/react-query";

export function useAssignPlayerClub() {
  return useMutation({
    mutationFn: ({ playerId, clubId }: { playerId: string; clubId: string }) =>
      assignPlayerClubAction(playerId, clubId),
  });
}
