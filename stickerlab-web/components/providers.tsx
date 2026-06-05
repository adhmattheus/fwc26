"use client";

import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="top-right" richColors theme="light" />
    </QueryClientProvider>
  );
}
