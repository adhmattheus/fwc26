import { IUserStickerRepository } from "../../domain/repositories/IUserStickerRepository";
import { AppError } from "../../shared/errors/AppError";

const ALBUM_CODE_REGEX = /^[A-Z]{2,3}-[1-9][0-9]?$/;

export class ToggleStickerUseCase {
  constructor(private userStickerRepository: IUserStickerRepository) {}

  async execute(userId: string, albumCode: string) {
    if (!ALBUM_CODE_REGEX.test(albumCode)) {
      throw new AppError("Formato de albumCode inválido", 400);
    }

    const existing = await this.userStickerRepository.findByUserIdAndAlbumCode(
      userId,
      albumCode,
    );

    if (existing) {
      await this.userStickerRepository.deleteByUserIdAndAlbumCode(
        userId,
        albumCode,
      );
      return { albumCode, owned: false };
    }

    await this.userStickerRepository.create(userId, albumCode);
    return { albumCode, owned: true };
  }
}
