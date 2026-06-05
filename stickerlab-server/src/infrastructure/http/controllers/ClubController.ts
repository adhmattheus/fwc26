// src/infrastructure/http/controllers/ClubController.ts

import { IncomingMessage, ServerResponse } from "http";
import { GetClubRankingUseCase } from "../../../application/use-cases/GetClubRankingUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { ClubRepository } from "../../database/repositories/ClubRepository";
import { sendError, sendJson } from "../helpers/httpResponse";

export class ClubController {
  private getClubRankingUseCase: GetClubRankingUseCase;

  constructor() {
    const clubRepository = new ClubRepository();
    this.getClubRankingUseCase = new GetClubRankingUseCase(clubRepository);
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
