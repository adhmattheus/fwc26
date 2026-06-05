import { IClubRepository } from "../../domain/repositories/IClubRepository";
import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";
import { AppError } from "../../shared/errors/AppError";

export class UpdatePlayerClubUseCase {
  constructor(
    private playerRepository: IPlayerRepository,
    private clubRepository: IClubRepository,
  ) {}

  async execute(playerId: string, clubId: string) {
    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new AppError("Club not found", 404);

    try {
      return await this.playerRepository.updateClub(playerId, clubId);
    } catch (error: any) {
      if (error?.code === "P2025") throw new AppError("Player not found", 404);
      throw error;
    }
  }
}
