import { authenticatedFetch } from "@repo/shared-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useMarkAllRead = () => {
  return useMutation({
    mutationFn: async () => {
      return authenticatedFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/mark-all-read`,
        {
          method: "PUT",
        },
      );
    },
    onError: (error) => {
      toast.error(error.message || "Operation Failed!!!");
    },
  });
};

export const useMarkread = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return authenticatedFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/mark-read/${id}`,
        {
          method: "PUT",
        },
      );
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["user-info"] });
      },
    onError: (error) => {
      toast.error(error.message || "Operation Failed!!!");
    },
  });
};
