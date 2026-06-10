import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { JwtService } from "../../infrastructure/auth/JwtService";
import { AppError } from "../../shared/errors/AppError";

export class RefreshTokenUseCase {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private jwtService: JwtService,
  ) {}

  async execute(token: string) {
    const stored = await this.refreshTokenRepository.findByToken(token);
    if (!stored) throw new AppError("Refresh token inválido", 401);

    if (stored.expiresAt < new Date()) {
      await this.refreshTokenRepository.deleteByToken(token);
      throw new AppError("Refresh token expirado", 401);
    }

    const payload = this.jwtService.verifyRefreshToken(token);
    const accessToken = this.jwtService.generateAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    return { accessToken };
  }
}
