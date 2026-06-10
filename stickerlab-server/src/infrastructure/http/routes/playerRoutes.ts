import { IncomingMessage, ServerResponse } from "http";
import { PlayerController } from "../controllers/PlayerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const controller = new PlayerController();

export async function playerRoutes(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "/";
  const method = req.method || "GET";

  const idMatch = url.match(/^\/api\/players\/([^/]+)$/);
  const id = idMatch ? idMatch[1] : null;

  const clubMatch = url.match(/^\/api\/players\/([^/]+)\/club$/);
  const clubPlayerId = clubMatch ? clubMatch[1] : null;

  if (method === "GET" && !id) return controller.getAll(req, res);

  // Rotas protegidas
  return new Promise<void>((resolve) => {
    authMiddleware(req, res, async () => {
      if (method === "POST" && !id) await controller.create(req, res);
      else if (method === "PUT" && id) await controller.update(req, res, id);
      else if (method === "DELETE" && id) await controller.delete(req, res, id);
      else if (method === "PATCH" && clubPlayerId)
        await controller.updateClub(req, res, clubPlayerId);
      else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
      resolve();
    });
  });
}
