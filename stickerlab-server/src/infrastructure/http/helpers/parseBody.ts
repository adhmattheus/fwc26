import { IncomingMessage } from "http";
import { AppError } from "../../../shared/errors/AppError";

const MAX_BODY_SIZE = 1 * 1024 * 1024; // 1MB

export function parseBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > MAX_BODY_SIZE) {
        req.destroy();
        reject(new AppError("Payload too large", 413));
      }
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body) as T);
      } catch {
        reject(new AppError("Invalid JSON body", 400));
      }
    });

    req.on("error", reject);
  });
}
