import { IStorageService } from "../../domain/repositories/IStorageService";
import { ITeamRepository } from "../../domain/repositories/ITeamRepository";
import { AppError } from "../../shared/errors/AppError";

export class UploadTeamBadgeUseCase {
  constructor(
    private teamRepository: ITeamRepository,
    private storageService: IStorageService,
  ) {}

  async execute(teamId: string, file: Buffer, mimeType: string) {
    const team = await this.teamRepository.findById(teamId);
    if (!team) throw new AppError("Team not found", 404);

    const key = `team-badges/${team.fifaCode.toLowerCase()}.png`;

    if (team.badgeUrl) {
      const oldKey = team.badgeUrl.split("/").slice(-2).join("/");
      await this.storageService.delete(oldKey);
    }

    const url = await this.storageService.upload(file, key, mimeType);

    return this.teamRepository.update(teamId, { badgeUrl: url });
  }
}
