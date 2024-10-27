"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60 * 1000 * 5,
            gcTime: 10 * 60 * 1000,
          },
        },
      })
  ); // 컴포넌트 마운트 시 한 번만 생성

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
