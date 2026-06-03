import { IncomingMessage, ServerResponse } from "http";
import { CreatePlayerUseCase } from "../../../application/use-cases/CreatePlayerUseCase";
import { DeletePlayerUseCase } from "../../../application/use-cases/DeletePlayerUseCase";
import { GetAllPlayersUseCase } from "../../../application/use-cases/GetAllPlayersUseCase";
import { UpdatePlayerUseCase } from "../../../application/use-cases/UpdatePlayerUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { PlayerRepository } from "../../database/repositories/PlayerRepository";
import { sendError, sendJson } from "../helpers/httpResponse";
import { parseBody } from "../helpers/parseBody";

export class PlayerController {
  private getAllPlayersUseCase: GetAllPlayersUseCase;
  private createPlayerUseCase: CreatePlayerUseCase;
  private updatePlayerUseCase: UpdatePlayerUseCase;
  private deletePlayerUseCase: DeletePlayerUseCase;

  constructor() {
    const playerRepository = new PlayerRepository();
    this.getAllPlayersUseCase = new GetAllPlayersUseCase(playerRepository);
    this.createPlayerUseCase = new CreatePlayerUseCase(playerRepository);
    this.updatePlayerUseCase = new UpdatePlayerUseCase(playerRepository);
    this.deletePlayerUseCase = new DeletePlayerUseCase(playerRepository);
  }

  async getAll(req: IncomingMessage, res: ServerResponse) {
    try {
      const url = new URL(req.url || "/", `http://localhost`);
      const teamId = url.searchParams.get("team_id") || "";
      const players = await this.getAllPlayersUseCase.execute(teamId);
      sendJson(res, 200, players);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Internal server error");
      }
    }
  }

  async create(req: IncomingMessage, res: ServerResponse) {
    try {
      const body = await parseBody<{
        name: string;
        canonicalName: string;
        albumCode?: string;
        inAlbum: boolean;
        calledUp: boolean;
        teamId: string;
      }>(req);
      const player = await this.createPlayerUseCase.execute(body);
      sendJson(res, 201, player);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Internal server error");
      }
    }
  }

  async update(req: IncomingMessage, res: ServerResponse, id: string) {
    try {
      const body = await parseBody<{
        name?: string;
        canonicalName?: string;
        albumCode?: string;
        inAlbum?: boolean;
        calledUp?: boolean;
      }>(req);
      const player = await this.updatePlayerUseCase.execute(id, body);
      sendJson(res, 200, player);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Internal server error");
      }
    }
  }

  async delete(_req: IncomingMessage, res: ServerResponse, id: string) {
    try {
      await this.deletePlayerUseCase.execute(id);
      sendJson(res, 200, { message: "Player deleted successfully" });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Internal server error");
      }
    }
  }
}
