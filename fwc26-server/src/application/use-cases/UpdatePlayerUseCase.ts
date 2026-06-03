import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";

interface UpdatePlayerInput {
  name?: string;
  canonicalName?: string;
  albumCode?: string;
  inAlbum?: boolean;
  calledUp?: boolean;
}

export class UpdatePlayerUseCase {
  constructor(private playerRepository: IPlayerRepository) {}

  async execute(id: string, input: UpdatePlayerInput) {
    return this.playerRepository.update(id, input);
  }
}
