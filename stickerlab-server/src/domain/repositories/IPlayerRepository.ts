import { Player } from "../entities/Player";

export interface IPlayerRepository {
  findByTeamId(teamId: string): Promise<Player[]>;
  countByTeamId(teamId: string): Promise<{
    inAlbumAndCalledUp: number;
    onlyInAlbum: number;
    calledUpWithoutSticker: number;
  }>;
  create(
    data: Omit<Player, "id" | "createdAt" | "updatedAt" | "club">,
  ): Promise<Player>;
  update(
    id: string,
    data: Partial<Omit<Player, "id" | "createdAt" | "updatedAt" | "club">>,
  ): Promise<Player>;
  delete(id: string): Promise<void>;
  updateClub(id: string, clubId: string): Promise<Player>;
}
