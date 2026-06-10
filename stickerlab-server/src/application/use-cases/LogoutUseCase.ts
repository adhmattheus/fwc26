import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { AppError } from "../../shared/errors/AppError";

export class LogoutUseCase {
  constructor(private refreshTokenRepository: IRefreshTokenRepository) {}

  async execute(token: string) {
    const stored = await this.refreshTokenRepository.findByToken(token);
    if (!stored) throw new AppError("Refresh token inválido", 401);

    await this.refreshTokenRepository.deleteByToken(token);
  }
}
