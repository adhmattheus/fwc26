const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  sub: string;
  email: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

async function login(email: string, password: string): Promise<AuthTokens> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciais inválidas");
  return res.json();
}

async function refresh(refreshToken: string): Promise<AuthTokens> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error("Sessão expirada");
  return res.json();
}

async function logout(refreshToken: string): Promise<void> {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
}

export const authService = { login, refresh, logout };
