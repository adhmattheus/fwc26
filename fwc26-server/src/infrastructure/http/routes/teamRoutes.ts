import { IncomingMessage, ServerResponse } from "http";
import { TeamController } from "../controllers/TeamController";

const controller = new TeamController();

export async function teamRoutes(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "/";
  const method = req.method || "GET";

  const uploadMatch = url.match(/^\/api\/teams\/([^/]+)\/upload-badge$/);
  const idMatch = url.match(/^\/api\/teams\/([^/]+)$/);

  const uploadId = uploadMatch ? uploadMatch[1] : null;
  const id = idMatch ? idMatch[1] : null;

  if (method === "POST" && uploadId)
    return controller.uploadBadge(req, res, uploadId);
  if (method === "GET" && !id) return controller.getAll(req, res);
  if (method === "GET" && id) return controller.getById(req, res, id);
  if (method === "POST" && !id) return controller.create(req, res);
  if (method === "PUT" && id) return controller.update(req, res, id);
  if (method === "DELETE" && id) return controller.delete(req, res, id);
}
