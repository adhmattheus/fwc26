import { IncomingMessage, ServerResponse } from "http";
import { GetAllGroupsUseCase } from "../../../application/use-cases/GetAllGroupsUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { GroupRepository } from "../../database/repositories/GroupRepository";
import { sendError, sendJson } from "../helpers/httpResponse";

export class GroupController {
  private getAllGroupsUseCase: GetAllGroupsUseCase;

  constructor() {
    const groupRepository = new GroupRepository();
    this.getAllGroupsUseCase = new GetAllGroupsUseCase(groupRepository);
  }

  async getAll(_req: IncomingMessage, res: ServerResponse) {
    try {
      const groups = await this.getAllGroupsUseCase.execute();
      sendJson(res, 200, groups);
    } catch (error) {
      console.error("GroupController error:", error);
      if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message);
      } else {
        sendError(res, 500, "Internal server error");
      }
    }
  }
}
