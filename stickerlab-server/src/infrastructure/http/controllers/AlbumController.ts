import { IncomingMessage, ServerResponse } from "http";
import { GetCollectionUseCase } from "../../../application/use-cases/GetCollectionUseCase";
import { ToggleStickerUseCase } from "../../../application/use-cases/ToggleStickerUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { UserStickerRepository } from "../../database/repositories/UserStickerRepository";
import { sendError, sendJson } from "../helpers/httpResponse";
import { parseBody } from "../helpers/parseBody";

const userStickerRepository = new UserStickerRepository();

type AuthRequest = IncomingMessage & { userId?: string; role?: string };

export class AlbumController {
  async getCollection(req: AuthRequest, res: ServerResponse) {
    try {
      const userId = req.userId!;
      const useCase = new GetCollectionUseCase(userStickerRepository);
      const result = await useCase.execute(userId);
      sendJson(res, 200, result);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Erro interno do servidor");
      }
    }
  }

  async toggleSticker(req: AuthRequest, res: ServerResponse) {
    try {
      const userId = req.userId!;
      const { albumCode } = await parseBody<{ albumCode: string }>(req);

      const useCase = new ToggleStickerUseCase(userStickerRepository);
      const result = await useCase.execute(userId, albumCode);
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
