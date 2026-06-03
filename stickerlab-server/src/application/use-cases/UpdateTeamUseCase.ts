import { ITeamRepository } from "../../domain/repositories/ITeamRepository";
import { AppError } from "../../shared/errors/AppError";

interface UpdateTeamInput {
  name?: string;
  fifaCode?: string;
  groupId?: string;
  colorPrimary?: string;
  colorSecondary?: string;
  badgeUrl?: string;
}

export class UpdateTeamUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(id: string, input: UpdateTeamInput) {
    const existing = await this.teamRepository.findById(id);
    if (!existing) throw new AppError("Team not found", 404);

    return this.teamRepository.update(id, input);
  }
}
