import { IGroupRepository } from "../../../domain/repositories/IGroupRepository";
import prisma from "../prismaClient";
import { PlayerRepository } from "./PlayerRepository";

const playerRepository = new PlayerRepository();

export class GroupRepository implements IGroupRepository {
  async findAll() {
    const groups = await prisma.group.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        teams: {
          select: {
            id: true,
            name: true,
            slug: true,
            fifaCode: true,
            badgeUrl: true,
            colorPrimary: true,
            colorSecondary: true,
          },
        },
      },
    });

    return Promise.all(
      groups.map(async (group: (typeof groups)[number]) => ({
        ...group,
        teams: await Promise.all(
          group.teams.map(async (team: (typeof group.teams)[number]) => ({
            ...team,
            comparison: await playerRepository.countByTeamId(team.id),
          })),
        ),
      })),
    );
  }
}
