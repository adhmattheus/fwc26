import "server-only";

import { authService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

async function refreshTokens(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) return null;

  try {
    const tokens = await authService.refresh(refreshToken);

    cookieStore.set("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    cookieStore.set("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return tokens.accessToken;
  } catch {
    return null;
  }
}

async function get<T>(endpoint: string): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    next: { revalidate: 0 },
  });

  if (res.status === 401) {
    const newToken = await refreshTokens();
    if (!newToken) redirect("/login");

    const retried = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${newToken}` },
      next: { revalidate: 0 },
    });

    if (!retried.ok) throw new Error(`API error: ${retried.status}`);
    return retried.json();
  }

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function mutation<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    const newToken = await refreshTokens();
    if (!newToken) redirect("/login");

    const retried = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!retried.ok) throw new Error(`API error: ${retried.status}`);
    return retried.json();
  }

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function upload<T>(endpoint: string, form: FormData): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (res.status === 401) {
    const newToken = await refreshTokens();
    if (!newToken) redirect("/login");

    const retried = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${newToken}` },
      body: form,
    });

    if (!retried.ok) throw new Error(`API error: ${retried.status}`);
    return retried.json();
  }

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const apiServer = {
  get: <T>(endpoint: string) => get<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) => mutation<T>(endpoint, "POST", body),
  put: <T>(endpoint: string, body?: unknown) => mutation<T>(endpoint, "PUT", body),
  patch: <T>(endpoint: string, body?: unknown) => mutation<T>(endpoint, "PATCH", body),
  delete: <T>(endpoint: string) => mutation<T>(endpoint, "DELETE"),
  upload: <T>(endpoint: string, form: FormData) => upload<T>(endpoint, form),
};
