import { RefreshToken } from "../../../domain/entities/RefreshToken";
import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";
import prisma from "../prismaClient";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data: { userId, token, expiresAt } });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async deleteByToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({ where: { token } });
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
