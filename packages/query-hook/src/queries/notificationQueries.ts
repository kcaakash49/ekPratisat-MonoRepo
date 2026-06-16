import { authenticatedFetch } from "@repo/shared-provider";
import { useQuery } from "@tanstack/react-query";

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      return authenticatedFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications`,
        { method: "GET" },
      );
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
    retryDelay: 2000,
    refetchOnWindowFocus: true,
  });
};
