import { Club } from "../../domain/entities/Club";
import { IClubRepository } from "../../domain/repositories/IClubRepository";

export class GetAllClubsUseCase {
  constructor(private readonly clubRepository: IClubRepository) {}

  async execute(): Promise<Club[]> {
    return this.clubRepository.findAll();
  }
}
