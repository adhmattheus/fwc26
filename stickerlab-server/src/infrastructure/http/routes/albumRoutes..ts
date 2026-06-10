import { IncomingMessage, ServerResponse } from "http";
import { AlbumController } from "../controllers/AlbumController";
import { authMiddleware } from "../middlewares/authMiddleware";

const controller = new AlbumController();

export async function albumRoutes(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const url = req.url || "/";
  const method = req.method || "GET";

  return new Promise<void>((resolve) => {
    authMiddleware(req, res, async () => {
      if (url === "/api/album/collection" && method === "GET") {
        await controller.getCollection(req, res);
      } else if (url === "/api/album/collection/toggle" && method === "POST") {
        await controller.toggleSticker(req, res);
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
      }
      resolve();
    });
  });
}
