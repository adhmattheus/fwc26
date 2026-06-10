import { UserSticker } from "../../../domain/entities/UserSticker";
import { IUserStickerRepository } from "../../../domain/repositories/IUserStickerRepository";
import prisma from "../prismaClient";

export class UserStickerRepository implements IUserStickerRepository {
  async findAllByUserId(userId: string): Promise<UserSticker[]> {
    return prisma.userSticker.findMany({ where: { userId } });
  }

  async findByUserIdAndAlbumCode(
    userId: string,
    albumCode: string,
  ): Promise<UserSticker | null> {
    return prisma.userSticker.findUnique({
      where: { userId_albumCode: { userId, albumCode } },
    });
  }

  async create(userId: string, albumCode: string): Promise<UserSticker> {
    return prisma.userSticker.create({ data: { userId, albumCode } });
  }

  async addManyIfNotOwned(userId: string, albumCodes: string[]): Promise<void> {
    await prisma.userSticker.createMany({
      data: albumCodes.map((albumCode) => ({ userId, albumCode })),
      skipDuplicates: true,
    });
  }

  async deleteByUserIdAndAlbumCode(
    userId: string,
    albumCode: string,
  ): Promise<void> {
    await prisma.userSticker.delete({
      where: { userId_albumCode: { userId, albumCode } },
    });
  }
}
