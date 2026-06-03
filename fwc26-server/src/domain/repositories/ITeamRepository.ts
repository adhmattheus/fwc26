import { Team } from "../entities/Team";

export interface ITeamRepository {
  findAll(): Promise<Team[]>;
  findById(id: string): Promise<Team | null>;
  findBySlug(slug: string): Promise<Team | null>;
  create(data: Omit<Team, "id" | "createdAt" | "updatedAt">): Promise<Team>;
  update(
    id: string,
    data: Partial<Omit<Team, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Team>;
  delete(id: string): Promise<void>;
}
