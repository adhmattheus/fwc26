"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export function UserGreeting() {
  const { data: user } = useCurrentUser();

  if (!user) return null;

  return (
    <div className="text-sm text-muted-foreground text-left leading-tight">
      <span className="font-medium text-foreground">Olá, {user.name}</span>
      <br />
      <span>
        {user.role} · {user.email}
      </span>
    </div>
  );
}
