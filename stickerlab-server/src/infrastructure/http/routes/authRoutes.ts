import { IncomingMessage, ServerResponse } from "http";
import { AuthController } from "../controllers/AuthController.ts";

const authController = new AuthController();

export async function authRoutes(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
): Promise<boolean> {
  if (pathname === "/api/auth/login" && req.method === "POST") {
    await authController.login(req, res);
    return true;
  }

  if (pathname === "/api/auth/refresh" && req.method === "POST") {
    await authController.refresh(req, res);
    return true;
  }

  if (pathname === "/api/auth/logout" && req.method === "POST") {
    await authController.logout(req, res);
    return true;
  }

  return false;
}
