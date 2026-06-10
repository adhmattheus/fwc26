import { IncomingMessage, ServerResponse } from "http";
import { JwtService } from "../../auth/JwtService";
import { sendError } from "../helpers/httpResponse";

const jwtService = new JwtService();

export function authMiddleware(
  req: IncomingMessage & { userId?: string; role?: string },
  res: ServerResponse,
  next: () => void,
) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, 401, "Token não fornecido");
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = jwtService.verifyAccessToken(token);

    req.userId = payload.userId;
    req.role = payload.role;

    next();
  } catch {
    sendError(res, 401, "Token inválido ou expirado");
  }
}
