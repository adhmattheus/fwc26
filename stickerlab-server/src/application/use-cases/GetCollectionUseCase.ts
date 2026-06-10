import { IUserStickerRepository } from "../../domain/repositories/IUserStickerRepository";

export class GetCollectionUseCase {
  constructor(private userStickerRepository: IUserStickerRepository) {}

  async execute(userId: string) {
    const stickers = await this.userStickerRepository.findAllByUserId(userId);
    return {
      albumCodes: stickers.map((s) => s.albumCode),
    };
  }
}
