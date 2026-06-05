// src/application/use-cases/GetClubRankingUseCase.ts

import { ClubRankingItem } from "../../domain/entities/Club";
import { IClubRepository } from "../../domain/repositories/IClubRepository";

export class GetClubRankingUseCase {
  constructor(private readonly clubRepository: IClubRepository) {}

  async execute(): Promise<ClubRankingItem[]> {
    return this.clubRepository.getRanking();
  }
}
