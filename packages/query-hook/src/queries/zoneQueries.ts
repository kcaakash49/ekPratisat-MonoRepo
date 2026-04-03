// @repo/query-hook/useZonesQuery.ts

import { useQuery } from "@tanstack/react-query";

export function useZonesQuery() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/zone/get-all`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch zones");
      }

      return data.zones;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}