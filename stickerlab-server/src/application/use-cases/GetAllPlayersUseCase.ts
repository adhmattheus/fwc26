import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";
import { AppError } from "../../shared/errors/AppError";

export class GetAllPlayersUseCase {
  constructor(private playerRepository: IPlayerRepository) {}

  async execute(teamId: string) {
    if (!teamId) throw new AppError("team_id is required", 400);
    return this.playerRepository.findByTeamId(teamId);
  }
}
