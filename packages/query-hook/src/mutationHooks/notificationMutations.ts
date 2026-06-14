import { authenticatedFetch } from "@repo/shared-provider";
import { useMutation } from "@tanstack/react-query";
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
}


export const useMarkread = () => {
    return useMutation({
    mutationFn: async (id:string) => {
      return authenticatedFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/mark-read/${id}`,
        {
          method: "PUT",
        },
      );
    },
    onError: (error) => {
      toast.error(error.message || "Operation Failed!!!");
    },
  });
}