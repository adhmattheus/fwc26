import { IncomingMessage, ServerResponse } from "http";
import { TeamController } from "../controllers/TeamController";
import { authMiddleware } from "../middlewares/authMiddleware";

const controller = new TeamController();

export async function teamRoutes(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "/";
  const method = req.method || "GET";

  const uploadMatch = url.match(/^\/api\/teams\/([^/]+)\/upload-badge$/);
  const idMatch = url.match(/^\/api\/teams\/([^/]+)$/);

  const uploadId = uploadMatch ? uploadMatch[1] : null;
  const id = idMatch ? idMatch[1] : null;

  if (method === "GET" && !id) return controller.getAll(req, res);
  if (method === "GET" && id) return controller.getById(req, res, id);

  // Rotas protegidas
  return new Promise<void>((resolve) => {
    authMiddleware(req, res, async () => {
      if (method === "POST" && uploadId)
        await controller.uploadBadge(req, res, uploadId);
      else if (method === "POST" && !id) await controller.create(req, res);
      else if (method === "PUT" && id) await controller.update(req, res, id);
      else if (method === "DELETE" && id) await controller.delete(req, res, id);
      resolve();
    });
  });
}
