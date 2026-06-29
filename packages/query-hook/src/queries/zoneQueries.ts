// @repo/query-hook/useZonesQuery.ts

import { authenticatedFetch } from "@repo/shared-provider";
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

export function useZoneQueryById(zoneId: string) {
  return useQuery({
    queryKey: ["zone", zoneId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/zone/get/${zoneId}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw data;
      }

      return data.zone;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false
  });
}

export function useGetMyZone() {
  return useQuery({
    queryKey:["my-zones"],
    queryFn: async () => {
     return authenticatedFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/zone/get-my-zone`,
        { method: "GET" },
      );
    },
    staleTime:5 * 60 * 1000,
    retry:false
  })
}
