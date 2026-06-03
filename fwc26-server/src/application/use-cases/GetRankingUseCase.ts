import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";
import { ITeamRepository } from "../../domain/repositories/ITeamRepository";

export class GetRankingUseCase {
  constructor(
    private teamRepository: ITeamRepository,
    private playerRepository: IPlayerRepository,
  ) {}

  async execute() {
    const teams = await this.teamRepository.findAll();

    const ranking = await Promise.all(
      teams.map(async (team, index) => {
        const players = await this.playerRepository.findByTeamId(team.id);

        const album = players.filter((p) => p.inAlbum);
        const inAlbumAndCalledUp = players.filter(
          (p) => p.inAlbum && p.calledUp,
        );
        const onlyInAlbum = players.filter((p) => p.inAlbum && !p.calledUp);

        const paniniAccuracyRate =
          album.length > 0
            ? (inAlbumAndCalledUp.length / album.length) * 100
            : 0;

        const errorRate =
          album.length > 0 ? (onlyInAlbum.length / album.length) * 100 : 0;

        return {
          rank: index + 1,
          team,
          statistics: {
            paniniAccuracyRate: Number(paniniAccuracyRate.toFixed(2)),
            errorRate: Number(errorRate.toFixed(2)),
          },
        };
      }),
    );

    return ranking
      .filter((item) => item.statistics.paniniAccuracyRate > 0)
      .sort(
        (a, b) =>
          b.statistics.paniniAccuracyRate - a.statistics.paniniAccuracyRate,
      )
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }
}
