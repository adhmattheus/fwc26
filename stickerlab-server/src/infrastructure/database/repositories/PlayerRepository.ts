import { Player } from "../../../domain/entities/Player";
import { IPlayerRepository } from "../../../domain/repositories/IPlayerRepository";
import prisma from "../prismaClient";

export class PlayerRepository implements IPlayerRepository {
  async findByTeamId(teamId: string): Promise<Player[]> {
    return prisma.player.findMany({
      where: { teamId },
      orderBy: [{ inAlbum: "desc" }, { albumCode: "asc" }],
    });
  }

  async create(
    data: Omit<Player, "id" | "createdAt" | "updatedAt">,
  ): Promise<Player> {
    return prisma.player.create({ data });
  }

  async update(
    id: string,
    data: Partial<Omit<Player, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Player> {
    return prisma.player.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.player.delete({ where: { id } });
  }

  async countByTeamId(teamId: string) {
    const [inAlbumAndCalledUp, onlyInAlbum, calledUpWithoutSticker] =
      await Promise.all([
        prisma.player.count({
          where: { teamId, inAlbum: true, calledUp: true },
        }),
        prisma.player.count({
          where: { teamId, inAlbum: true, calledUp: false },
        }),
        prisma.player.count({
          where: { teamId, inAlbum: false, calledUp: true },
        }),
      ]);

    return { inAlbumAndCalledUp, onlyInAlbum, calledUpWithoutSticker };
  }
}
