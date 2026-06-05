import { IncomingMessage, ServerResponse } from "http";
import { GetAllClubsUseCase } from "../../../application/use-cases/GetAllClubsUseCase";
import { GetClubRankingUseCase } from "../../../application/use-cases/GetClubRankingUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { ClubRepository } from "../../database/repositories/ClubRepository";
import { sendError, sendJson } from "../helpers/httpResponse";

export class ClubController {
  private getAllClubsUseCase: GetAllClubsUseCase;
  private getClubRankingUseCase: GetClubRankingUseCase;

  constructor() {
    const clubRepository = new ClubRepository();
    this.getAllClubsUseCase = new GetAllClubsUseCase(clubRepository);
    this.getClubRankingUseCase = new GetClubRankingUseCase(clubRepository);
  }

  async getAll(_req: IncomingMessage, res: ServerResponse) {
    try {
      const clubs = await this.getAllClubsUseCase.execute();
      sendJson(res, 200, { total: clubs.length, data: clubs });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Internal server error");
      }
    }
  }

  async getRanking(_req: IncomingMessage, res: ServerResponse) {
    try {
      const ranking = await this.getClubRankingUseCase.execute();
      sendJson(res, 200, ranking);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Internal server error");
      }
    }
  }
}
