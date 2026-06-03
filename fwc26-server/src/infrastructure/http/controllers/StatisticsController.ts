import { IncomingMessage, ServerResponse } from "http";
import { GetOverallStatisticsUseCase } from "../../../application/use-cases/GetOverallStatisticsUseCase";
import { GetRankingUseCase } from "../../../application/use-cases/GetRankingUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { PlayerRepository } from "../../database/repositories/PlayerRepository";
import { TeamRepository } from "../../database/repositories/TeamRepository";
import { sendError, sendJson } from "../helpers/httpResponse";

export class StatisticsController {
  private getOverallStatisticsUseCase: GetOverallStatisticsUseCase;
  private getRankingUseCase: GetRankingUseCase;

  constructor() {
    const teamRepository = new TeamRepository();
    const playerRepository = new PlayerRepository();
    this.getOverallStatisticsUseCase = new GetOverallStatisticsUseCase(
      teamRepository,
      playerRepository,
    );
    this.getRankingUseCase = new GetRankingUseCase(
      teamRepository,
      playerRepository,
    );
  }

  async getOverall(_req: IncomingMessage, res: ServerResponse) {
    try {
      const statistics = await this.getOverallStatisticsUseCase.execute();
      sendJson(res, 200, statistics);
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
      const ranking = await this.getRankingUseCase.execute();
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
