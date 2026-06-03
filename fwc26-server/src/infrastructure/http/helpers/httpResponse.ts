import { ServerResponse } from "http";

export function sendJson(
  res: ServerResponse,
  statusCode: number,
  data: unknown,
) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

export function sendError(
  res: ServerResponse,
  statusCode: number,
  message: string,
) {
  sendJson(res, statusCode, { message });
}
