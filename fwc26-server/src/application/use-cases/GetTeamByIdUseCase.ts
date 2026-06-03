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

    const album = players.filter((p) => p.inAlbum);
    const calledUp = players.filter((p) => p.calledUp);
    const inAlbumAndCalledUp = players.filter((p) => p.inAlbum && p.calledUp);
    const onlyInAlbum = players.filter((p) => p.inAlbum && !p.calledUp);
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
