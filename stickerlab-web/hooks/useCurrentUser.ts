"use client";

import type { UserProfile } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export type { UserProfile };

export function useCurrentUser() {
  return useQuery<UserProfile>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
