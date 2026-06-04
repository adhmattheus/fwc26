import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";
import { ITeamRepository } from "../../domain/repositories/ITeamRepository";
import { AppError } from "../../shared/errors/AppError";

export class GetTeamByIdUseCase {
  constructor(
    private teamRepository: ITeamRepository,
    private playerRepository: IPlayerRepository,
  ) {}

  async execute(id: string) {
    const team = await this.teamRepository.findById(id);
    if (!team) throw new AppError("Team not found", 404);

    const players = await this.playerRepository.findByTeamId(team.id);

    const sortByAlbumCode = <T extends { albumCode: string | null }>(
      arr: T[],
    ): T[] =>
      [...arr].sort((a, b) => {
        if (!a.albumCode || !b.albumCode) return 0;
        const numA = parseInt(a.albumCode.split("-")[1]);
        const numB = parseInt(b.albumCode.split("-")[1]);
        return numA - numB;
      });

    const album = sortByAlbumCode(players.filter((p) => p.inAlbum));
    const calledUp = players.filter((p) => p.calledUp);
    const inAlbumAndCalledUp = sortByAlbumCode(
      players.filter((p) => p.inAlbum && p.calledUp),
    );
    const onlyInAlbum = sortByAlbumCode(
      players.filter((p) => p.inAlbum && !p.calledUp),
    );
    const calledUpWithoutSticker = players.filter(
      (p) => p.calledUp && !p.inAlbum,
    );

    const paniniAccuracyRate =
      album.length > 0 ? (inAlbumAndCalledUp.length / album.length) * 100 : 0;

    const errorRate =
      album.length > 0 ? (onlyInAlbum.length / album.length) * 100 : 0;

    return {
      team,
      players: { album, calledUp },
      comparison: {
        inAlbumAndCalledUp: {
          total: inAlbumAndCalledUp.length,
          players: inAlbumAndCalledUp,
        },
        onlyInAlbum: {
          total: onlyInAlbum.length,
          players: onlyInAlbum,
        },
        calledUpWithoutSticker: {
          total: calledUpWithoutSticker.length,
          players: calledUpWithoutSticker,
        },
      },
      statistics: {
        paniniAccuracyRate: Number(paniniAccuracyRate.toFixed(2)),
        errorRate: Number(errorRate.toFixed(2)),
      },
    };
  }
}
