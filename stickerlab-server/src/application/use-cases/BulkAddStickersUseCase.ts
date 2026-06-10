import { IUserStickerRepository } from "../../domain/repositories/IUserStickerRepository";
import { AppError } from "../../shared/errors/AppError";

const ALBUM_CODE_REGEX = /^[A-Z]{2,3}-[0-9][0-9]?$/;
const MAX_BULK_SIZE = 50;

export class BulkAddStickersUseCase {
  constructor(private userStickerRepository: IUserStickerRepository) {}

  async execute(userId: string, albumCodes: string[]) {
    if (!Array.isArray(albumCodes) || albumCodes.length === 0) {
      throw new AppError("albumCodes deve ser um array não-vazio", 400);
    }

    if (albumCodes.length > MAX_BULK_SIZE) {
      throw new AppError(`Máximo de ${MAX_BULK_SIZE} itens por request`, 400);
    }

    const invalid = albumCodes.find((code) => !ALBUM_CODE_REGEX.test(code));
    if (invalid) {
      throw new AppError(`Formato de albumCode inválido: ${invalid}`, 400);
    }

    await this.userStickerRepository.addManyIfNotOwned(userId, albumCodes);

    return { albumCodes, owned: true };
  }
}
