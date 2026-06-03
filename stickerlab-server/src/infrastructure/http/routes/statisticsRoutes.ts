import { IncomingMessage, ServerResponse } from "http";
import { StatisticsController } from "../controllers/StatisticsController";

const controller = new StatisticsController();

export async function statisticsRoutes(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const url = req.url || "/";
  const method = req.method || "GET";

  if (method === "GET" && url === "/api/statistics/overall")
    return controller.getOverall(req, res);
  if (method === "GET" && url === "/api/statistics/ranking")
    return controller.getRanking(req, res);
}
