import { IncomingMessage, ServerResponse } from "http";
import { GetMeUseCase } from "../../../application/use-cases/GetMeUseCase";
import { LoginUseCase } from "../../../application/use-cases/LoginUseCase";
import { LogoutUseCase } from "../../../application/use-cases/LogoutUseCase";
import { RefreshTokenUseCase } from "../../../application/use-cases/RefreshTokenUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { JwtService } from "../../auth/JwtService";
import { RefreshTokenRepository } from "../../database/repositories/RefreshTokenRepository";
import { UserRepository } from "../../database/repositories/UserRepository";
import { sendError, sendJson } from "../helpers/httpResponse";
import { parseBody } from "../helpers/parseBody";

const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const jwtService = new JwtService();

export class AuthController {
  async login(req: IncomingMessage, res: ServerResponse) {
    try {
      const { email, password } = await parseBody<{
        email: string;
        password: string;
      }>(req);

      const useCase = new LoginUseCase(
        userRepository,
        refreshTokenRepository,
        jwtService,
      );
      const result = await useCase.execute(email, password);

      sendJson(res, 200, result);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Erro interno do servidor");
      }
    }
  }

  async refresh(req: IncomingMessage, res: ServerResponse) {
    try {
      const { refreshToken } = await parseBody<{ refreshToken: string }>(req);

      const useCase = new RefreshTokenUseCase(
        refreshTokenRepository,
        jwtService,
      );
      const result = await useCase.execute(refreshToken);

      sendJson(res, 200, result);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Erro interno do servidor");
      }
    }
  }

  async logout(req: IncomingMessage, res: ServerResponse) {
    try {
      const { refreshToken } = await parseBody<{ refreshToken: string }>(req);

      const useCase = new LogoutUseCase(refreshTokenRepository);
      await useCase.execute(refreshToken);

      sendJson(res, 200, { message: "Logout realizado com sucesso" });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Erro interno do servidor");
      }
    }
  }

  async me(req: IncomingMessage & { userId?: string }, res: ServerResponse) {
    try {
      const useCase = new GetMeUseCase(userRepository);
      const result = await useCase.execute(req.userId!);
      sendJson(res, 200, result);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Erro interno do servidor");
      }
    }
  }
}
