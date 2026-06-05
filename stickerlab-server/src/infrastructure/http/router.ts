import { readFileSync } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { join } from "path";
import { swaggerSpec } from "./docs/swagger";
import { clubRoutes } from "./routes/clubRoutes";
import { groupRoutes } from "./routes/groupRoutes";
import { playerRoutes } from "./routes/playerRoutes";
import { statisticsRoutes } from "./routes/statisticsRoutes";
import { teamRoutes } from "./routes/teamRoutes";

const swaggerUiPath = join(process.cwd(), "node_modules", "swagger-ui-dist");

export async function router(req: IncomingMessage, res: ServerResponse) {
  const url = req.url || "/";

  try {
    // Swagger JSON
    if (url === "/api/docs/json") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(swaggerSpec));
      return;
    }

    // Swagger UI
    if (url === "/api/docs" || url === "/api/docs/") {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>StickerLab API Docs</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" type="text/css" href="/api/docs/swagger-ui.css" >
          </head>
          <body>
            <div id="swagger-ui"></div>
            <script src="/api/docs/swagger-ui-bundle.js"></script>
            <script src="/api/docs/swagger-ui-standalone-preset.js"></script>
            <script>
              window.onload = function() {
                SwaggerUIBundle({
                  url: "/api/docs/json",
                  dom_id: '#swagger-ui',
                  presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
                  layout: "StandaloneLayout"
                })
              }
            </script>
          </body>
        </html>
      `;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      return;
    }

    // Swagger UI static files
    if (url.startsWith("/api/docs/")) {
      const fileName = url.replace("/api/docs/", "");
      const filePath = join(swaggerUiPath, fileName);
      try {
        const file = readFileSync(filePath);
        const contentType = fileName.endsWith(".css")
          ? "text/css"
          : "application/javascript";
        res.writeHead(200, { "Content-Type": contentType });
        res.end(file);
      } catch {
        res.writeHead(404);
        res.end();
      }
      return;
    }

    if (url.startsWith("/api/clubs")) return await clubRoutes(req, res);
    if (url.startsWith("/api/groups")) return await groupRoutes(req, res);
    if (url.startsWith("/api/teams")) return await teamRoutes(req, res);
    if (url.startsWith("/api/players")) return await playerRoutes(req, res);
    if (url.startsWith("/api/statistics"))
      return await statisticsRoutes(req, res);

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  } catch (error) {
    console.error("Router error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}
