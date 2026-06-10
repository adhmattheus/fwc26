import { IncomingMessage, ServerResponse } from "http";
import { BulkAddStickersUseCase } from "../../../application/use-cases/BulkAddStickersUseCase";
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
      const body = await parseBody<{ albumCode?: string; albumCodes?: string[] }>(req);

      if (body.albumCodes !== undefined) {
        const useCase = new BulkAddStickersUseCase(userStickerRepository);
        const result = await useCase.execute(userId, body.albumCodes);
        sendJson(res, 200, result);
      } else {
        const useCase = new ToggleStickerUseCase(userStickerRepository);
        const result = await useCase.execute(userId, body.albumCode as string);
        sendJson(res, 200, result);
      }
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Erro interno do servidor");
      }
    }
  }
}
