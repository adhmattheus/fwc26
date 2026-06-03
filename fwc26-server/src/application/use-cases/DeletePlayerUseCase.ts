import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";

export class DeletePlayerUseCase {
  constructor(private playerRepository: IPlayerRepository) {}

  async execute(id: string) {
    await this.playerRepository.delete(id);
  }
}
