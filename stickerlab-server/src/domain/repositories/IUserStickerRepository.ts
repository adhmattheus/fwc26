import { UserSticker } from "../entities/UserSticker";

export interface IUserStickerRepository {
  findAllByUserId(userId: string): Promise<UserSticker[]>;
  findByUserIdAndAlbumCode(
    userId: string,
    albumCode: string,
  ): Promise<UserSticker | null>;
  create(userId: string, albumCode: string): Promise<UserSticker>;
  deleteByUserIdAndAlbumCode(userId: string, albumCode: string): Promise<void>;
}
