import { IncomingMessage, ServerResponse } from "http";
import { PlayerController } from "../controllers/PlayerController";

const controller = new PlayerController();

export async function playerRoutes(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "/";
  const method = req.method || "GET";

  const idMatch = url.match(/^\/api\/players\/([^/]+)$/);
  const id = idMatch ? idMatch[1] : null;

  const clubMatch = url.match(/^\/api\/players\/([^/]+)\/club$/);
  const clubPlayerId = clubMatch ? clubMatch[1] : null;

  if (method === "GET" && !id) return controller.getAll(req, res);
  if (method === "POST" && !id) return controller.create(req, res);
  if (method === "PUT" && id) return controller.update(req, res, id);
  if (method === "DELETE" && id) return controller.delete(req, res, id);
  if (method === "PATCH" && clubPlayerId)
    return controller.updateClub(req, res, clubPlayerId);

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
}
