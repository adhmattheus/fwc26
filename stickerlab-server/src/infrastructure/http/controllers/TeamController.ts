import { IncomingMessage, ServerResponse } from "http";
import multiparty from "multiparty";
import { CreateTeamUseCase } from "../../../application/use-cases/CreateTeamUseCase";
import { DeleteTeamUseCase } from "../../../application/use-cases/DeleteTeamUseCase";
import { GetAllTeamsUseCase } from "../../../application/use-cases/GetAllTeamsUseCase";
import { GetTeamByIdUseCase } from "../../../application/use-cases/GetTeamByIdUseCase";
import { UpdateTeamUseCase } from "../../../application/use-cases/UpdateTeamUseCase";
import { UploadTeamBadgeUseCase } from "../../../application/use-cases/UploadTeamBadgeUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { PlayerRepository } from "../../database/repositories/PlayerRepository";
import { TeamRepository } from "../../database/repositories/TeamRepository";
import { S3Service } from "../../storage/S3Service";
import { sendError, sendJson } from "../helpers/httpResponse";
import { parseBody } from "../helpers/parseBody";

export class TeamController {
  private getAllTeamsUseCase: GetAllTeamsUseCase;
  private getTeamByIdUseCase: GetTeamByIdUseCase;
  private createTeamUseCase: CreateTeamUseCase;
  private updateTeamUseCase: UpdateTeamUseCase;
  private deleteTeamUseCase: DeleteTeamUseCase;
  private uploadTeamBadgeUseCase: UploadTeamBadgeUseCase;

  constructor() {
    const teamRepository = new TeamRepository();
    const playerRepository = new PlayerRepository();
    this.getAllTeamsUseCase = new GetAllTeamsUseCase(teamRepository);
    this.getTeamByIdUseCase = new GetTeamByIdUseCase(
      teamRepository,
      playerRepository,
    );
    this.createTeamUseCase = new CreateTeamUseCase(teamRepository);
    this.updateTeamUseCase = new UpdateTeamUseCase(teamRepository);
    this.deleteTeamUseCase = new DeleteTeamUseCase(teamRepository);
    const storageService = new S3Service();
    this.uploadTeamBadgeUseCase = new UploadTeamBadgeUseCase(
      teamRepository,
      storageService,
    );
  }

  async getAll(_req: IncomingMessage, res: ServerResponse) {
    try {
      const teams = await this.getAllTeamsUseCase.execute();
      sendJson(res, 200, teams);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Internal server error");
      }
    }
  }

  async getById(_req: IncomingMessage, res: ServerResponse, id: string) {
    try {
      const result = await this.getTeamByIdUseCase.execute(id);
      sendJson(res, 200, result);
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
        fifaCode: string;
        groupId: string;
        colorPrimary: string;
        colorSecondary: string;
      }>(req);
      const team = await this.createTeamUseCase.execute(body);
      sendJson(res, 201, team);
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
        fifaCode?: string;
        groupId?: string;
        colorPrimary?: string;
        colorSecondary?: string;
        badgeUrl?: string;
      }>(req);
      const team = await this.updateTeamUseCase.execute(id, body);
      sendJson(res, 200, team);
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
      await this.deleteTeamUseCase.execute(id);
      sendJson(res, 200, { message: "Team deleted successfully" });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Internal server error");
      }
    }
  }

  async uploadBadge(req: IncomingMessage, res: ServerResponse, id: string) {
    const form = new multiparty.Form();

    form.parse(req, async (err, _fields, files) => {
      if (err) return sendError(res, 400, "Invalid form data");

      try {
        const file = files.file?.[0];
        if (!file) return sendError(res, 400, "No file provided");

        const fs = await import("fs");
        const fileBuffer = fs.readFileSync(file.path);
        const mimeType = file.headers["content-type"] || "image/png";

        const team = await this.uploadTeamBadgeUseCase.execute(
          id,
          fileBuffer,
          mimeType,
        );
        sendJson(res, 200, {
          badgeUrl: team.badgeUrl,
          message: "Badge uploaded successfully",
        });
      } catch (error) {
        if (error instanceof AppError) {
          sendError(res, error.statusCode, error.message);
        } else {
          sendError(res, 500, "Internal server error");
        }
      }
    });
  }
}
