import { ITeamRepository } from "../../domain/repositories/ITeamRepository";
import { AppError } from "../../shared/errors/AppError";

export class DeleteTeamUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(id: string) {
    const existing = await this.teamRepository.findById(id);
    if (!existing) throw new AppError("Team not found", 404);

    await this.teamRepository.delete(id);
  }
}
