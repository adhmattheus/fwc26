// src/infrastructure/database/repositories/ClubRepository.ts

import { Club, ClubRankingItem } from "../../../domain/entities/Club";
import { IClubRepository } from "../../../domain/repositories/IClubRepository";
import prisma from "../prismaClient";

// Total de convocados: 48 seleções × 26 jogadores
const TOTAL_CALLED_UP = 1248;

export class ClubRepository implements IClubRepository {
  async findAll(): Promise<Club[]> {
    const clubs = await prisma.club.findMany({
      orderBy: { name: "asc" },
    });
    return clubs.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Club | null> {
    const club = await prisma.club.findUnique({ where: { id } });
    return club ? this.mapToEntity(club) : null;
  }

  async findBySlug(slug: string): Promise<Club | null> {
    const club = await prisma.club.findUnique({ where: { slug } });
    return club ? this.mapToEntity(club) : null;
  }

  async getRanking(): Promise<ClubRankingItem[]> {
    // Busca apenas jogadores convocados e com figurinha no álbum
    const result = await prisma.club.findMany({
      include: {
        _count: {
          select: {
            players: {
              where: { calledUp: true, inAlbum: true },
            },
          },
        },
      },
      orderBy: [{ players: { _count: "desc" } }, { name: "asc" }],
    });

    return result
      .filter((club) => club._count.players > 0)
      .map((club) => ({
        id: club.id,
        name: club.name,
        slug: club.slug,
        countryCode: club.countryCode,
        badgeUrl: club.badgeUrl,
        playerCount: club._count.players,
        percentage: parseFloat(
          ((club._count.players / TOTAL_CALLED_UP) * 100).toFixed(2),
        ),
      }));
  }

  private mapToEntity(club: any): Club {
    return {
      id: club.id,
      name: club.name,
      slug: club.slug,
      countryCode: club.countryCode,
      badgeUrl: club.badgeUrl,
      createdAt: club.createdAt,
      updatedAt: club.updatedAt,
    };
  }
}
