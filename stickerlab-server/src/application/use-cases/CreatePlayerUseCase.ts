import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";

interface CreatePlayerInput {
  name: string;
  canonicalName: string;
  albumCode?: string;
  inAlbum: boolean;
  calledUp: boolean;
  teamId: string;
  clubId?: string | null;
}

export class CreatePlayerUseCase {
  constructor(private playerRepository: IPlayerRepository) {}

  async execute(input: CreatePlayerInput) {
    return this.playerRepository.create({
      ...input,
      albumCode: input.albumCode ?? null,
      clubId: input.clubId ?? null,
    });
  }
}
