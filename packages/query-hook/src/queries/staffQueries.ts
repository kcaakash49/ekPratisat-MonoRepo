import { useQuery } from "@tanstack/react-query";


export const useGetStaffList = (options = {}) => {
  return useQuery({
    queryKey: ["staff-list"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/staff/get-all`,
        { credentials: "include" },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch staff list");
      }
      console.log("Fetched staff list:", data);
      return {
        result:data
      };
    },
    retry: 1,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });
};

