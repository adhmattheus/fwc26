import { UserSticker } from "../entities/UserSticker";

export interface IUserStickerRepository {
  findAllByUserId(userId: string): Promise<UserSticker[]>;
  findByUserIdAndAlbumCode(
    userId: string,
    albumCode: string,
  ): Promise<UserSticker | null>;
  create(userId: string, albumCode: string): Promise<UserSticker>;
  addManyIfNotOwned(userId: string, albumCodes: string[]): Promise<void>;
  deleteByUserIdAndAlbumCode(userId: string, albumCode: string): Promise<void>;
}
