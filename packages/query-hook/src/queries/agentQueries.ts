import { getAgentDetailAction, getAgentListAction } from "@repo/actions";
import { useQuery } from "@tanstack/react-query";

export const useGetAgents = (options = {}) => {
  return useQuery({
    queryKey: ["agents-list"],
    queryFn: getAgentListAction,
    retry: 1,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });
};

export const useGetAgentDetail = (id: string) => {
  return useQuery({
    queryKey: ["agent-detail", id],
    queryFn: async () => {
      const res = await getAgentDetailAction(id);
      if (res.status === 200) {
        return res;
      }
    },
    retry: 1,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user-info"],
    queryFn: async () => {
      console.log("Fetching user info...");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/my-info`,
        { credentials: "include" },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch zones");
      }

      return data.user;
    },
    retry: 1,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
