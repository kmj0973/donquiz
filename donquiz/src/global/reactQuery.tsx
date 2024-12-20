"use client";

import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
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
            staleTime: 60 * 1000 * 10,
          },
        },
      })
  ); // 컴포넌트 마운트 시 한 번만 생성

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={null}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
