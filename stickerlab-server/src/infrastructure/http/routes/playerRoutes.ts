import { IncomingMessage, ServerResponse } from "http";
import { PlayerController } from "../controllers/PlayerController";

const controller = new PlayerController();

export async function playerRoutes(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "/";
  const method = req.method || "GET";

  const idMatch = url.match(/^\/api\/players\/([^/]+)$/);
  const id = idMatch ? idMatch[1] : null;

  if (method === "GET" && !id) return controller.getAll(req, res);
  if (method === "POST" && !id) return controller.create(req, res);
  if (method === "PUT" && id) return controller.update(req, res, id);
  if (method === "DELETE" && id) return controller.delete(req, res, id);
}
