import { ITeamRepository } from "../../domain/repositories/ITeamRepository";

export class GetAllTeamsUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute() {
    return this.teamRepository.findAll();
  }
}
