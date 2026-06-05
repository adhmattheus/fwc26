import { IClubRepository } from "../../domain/repositories/IClubRepository";
import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";
import { ITeamRepository } from "../../domain/repositories/ITeamRepository";

export class GetOverallStatisticsUseCase {
  constructor(
    private teamRepository: ITeamRepository,
    private playerRepository: IPlayerRepository,
    private clubRepository: IClubRepository,
  ) {}

  async execute() {
    const teams = await this.teamRepository.findAll();

    let totalAlbumPlayers = 0;
    let totalCalledUpPlayers = 0;
    let totalInAlbumAndCalledUp = 0;
    let totalOnlyInAlbum = 0;
    let totalCalledUpWithoutSticker = 0;

    for (const team of teams) {
      const players = await this.playerRepository.findByTeamId(team.id);

      totalAlbumPlayers += players.filter((p) => p.inAlbum).length;
      totalCalledUpPlayers += players.filter((p) => p.calledUp).length;
      totalInAlbumAndCalledUp += players.filter(
        (p) => p.inAlbum && p.calledUp,
      ).length;
      totalOnlyInAlbum += players.filter(
        (p) => p.inAlbum && !p.calledUp,
      ).length;
      totalCalledUpWithoutSticker += players.filter(
        (p) => p.calledUp && !p.inAlbum,
      ).length;
    }

    const paniniAccuracyRate =
      totalAlbumPlayers > 0
        ? (totalInAlbumAndCalledUp / totalAlbumPlayers) * 100
        : 0;

    const errorRate =
      totalAlbumPlayers > 0 ? (totalOnlyInAlbum / totalAlbumPlayers) * 100 : 0;

    // Busca o clube mais representado
    const clubRanking = await this.clubRepository.getRanking();
    const mostRepresentedClub = clubRanking[0] || null;

    return {
      totalTeams: teams.length,
      totalAlbumPlayers,
      totalCalledUpPlayers,
      totalInAlbumAndCalledUp,
      totalOnlyInAlbum,
      totalCalledUpWithoutSticker,
      paniniAccuracyRate: Number(paniniAccuracyRate.toFixed(2)),
      errorRate: Number(errorRate.toFixed(2)),
      mostRepresentedClub: mostRepresentedClub
        ? {
            club: mostRepresentedClub.name,
            percentage: mostRepresentedClub.percentage,
            playerCount: mostRepresentedClub.playerCount,
            totalPlayers: totalCalledUpPlayers,
          }
        : null,
    };
  }
}
