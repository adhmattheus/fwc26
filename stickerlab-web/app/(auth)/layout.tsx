import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 pb-48">
      {children}
    </main>
  );
}
