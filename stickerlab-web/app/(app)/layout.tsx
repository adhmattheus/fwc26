import { Header } from "@/components/layout/header";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
    </>
  );
}
