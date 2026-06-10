"use server";

import { authService, type AuthUser } from "@/services/auth.service";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type ActionResult = { success: true } | { success: false; error: string };

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const USER_KEY = "user";

export async function loginAction(
  email: string,
  password: string,
): Promise<ActionResult> {
  try {
    const { accessToken, refreshToken } = await authService.login(email, password);
    const payload = decodeJwt(accessToken) as AuthUser;
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    cookieStore.set(REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set(
      USER_KEY,
      JSON.stringify({ sub: payload.sub, email: payload.email }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      },
    );

    return { success: true };
  } catch {
    return { success: false, error: "E-mail ou senha inválidos." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;

  if (refreshToken) {
    await authService.logout(refreshToken).catch(() => {});
  }

  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete(REFRESH_TOKEN);
  cookieStore.delete(USER_KEY);

  redirect("/login");
}
