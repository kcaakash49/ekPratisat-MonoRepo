// @repo/query-hook/src/hooks/useCreateUser.ts
import { addUserAction } from "@repo/actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: addUserAction,
    onError: () => {
      toast.error("Unexpected error");
    },
  });
      
};
