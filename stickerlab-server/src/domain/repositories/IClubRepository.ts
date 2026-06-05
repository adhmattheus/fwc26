import { Club, ClubRankingItem } from "../entities/Club";

export interface IClubRepository {
  findAll(): Promise<Club[]>;
  findById(id: string): Promise<Club | null>;
  findBySlug(slug: string): Promise<Club | null>;
  getRanking(): Promise<ClubRankingItem[]>;
}
