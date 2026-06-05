// src/infrastructure/http/routes/clubRoutes.ts

import { IncomingMessage, ServerResponse } from "http";
import { ClubController } from "../controllers/ClubController";

const controller = new ClubController();

export async function clubRoutes(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "/";
  const method = req.method || "GET";

  if (method === "GET" && url === "/api/clubs/ranking") {
    return controller.getRanking(req, res);
  }
}
