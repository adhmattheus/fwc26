"use client";

import { useMemo } from "react";

export interface CurrentUser {
  sub: string;
  email: string;
}

export function useCurrentUser(): CurrentUser | null {
  return useMemo(() => {
    if (typeof document === "undefined") return null;

    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));

    if (!match) return null;

    try {
      return JSON.parse(decodeURIComponent(match.split("=")[1]));
    } catch {
      return null;
    }
  }, []);
}
