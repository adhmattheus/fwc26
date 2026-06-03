import { IncomingMessage, ServerResponse } from "http";
import { GroupController } from "../controllers/GroupController";

const controller = new GroupController();

export async function groupRoutes(req: IncomingMessage, res: ServerResponse) {
  const { method } = req;

  if (method === "GET") {
    return controller.getAll(req, res);
  }
}
