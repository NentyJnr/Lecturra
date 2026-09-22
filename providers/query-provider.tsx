"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (globalThis.window === undefined) {
    // Server: always create a fresh client per request
    return makeQueryClient();
  }
  // Client: reuse a singleton so cache survives navigation
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = React.useState(getQueryClient)[0];
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
