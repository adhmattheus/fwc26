import { IncomingMessage, ServerResponse } from "http";
import { AuthController } from "../controllers/AuthController.ts";
import { authMiddleware } from "../middlewares/authMiddleware";

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

  if (pathname === "/api/auth/me" && req.method === "GET") {
    return new Promise<boolean>((resolve) => {
      authMiddleware(req, res, async () => {
        await authController.me(req, res);
        resolve(true);
      });
    });
  }

  return false;
}
