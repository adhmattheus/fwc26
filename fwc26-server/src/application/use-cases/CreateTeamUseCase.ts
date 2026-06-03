import { ITeamRepository } from "../../domain/repositories/ITeamRepository";
import { AppError } from "../../shared/errors/AppError";

interface CreateTeamInput {
  name: string;
  fifaCode: string;
  groupId: string;
  colorPrimary: string;
  colorSecondary: string;
}

export class CreateTeamUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(input: CreateTeamInput) {
    const slug = input.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

    const existing = await this.teamRepository.findBySlug(slug);
    if (existing) throw new AppError("Team already exists", 409);

    return this.teamRepository.create({
      ...input,
      slug,
      badgeUrl: null,
    });
  }
}
