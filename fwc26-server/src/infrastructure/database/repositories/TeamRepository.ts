import { Team } from "../../../domain/entities/Team";
import { ITeamRepository } from "../../../domain/repositories/ITeamRepository";
import prisma from "../prismaClient";

export class TeamRepository implements ITeamRepository {
  async findAll(): Promise<Team[]> {
    return prisma.team.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findBySlug(slug: string): Promise<Team | null> {
    return prisma.team.findUnique({
      where: { slug },
    });
  }

  async create(
    data: Omit<Team, "id" | "createdAt" | "updatedAt">,
  ): Promise<Team> {
    return prisma.team.create({ data });
  }

  async update(
    id: string,
    data: Partial<Omit<Team, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Team> {
    return prisma.team.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.team.delete({ where: { id } });
  }

  async findById(id: string): Promise<Team | null> {
    return prisma.team.findUnique({
      where: { id },
    });
  }
}
