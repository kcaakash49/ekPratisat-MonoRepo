// @repo/query-hook/src/hooks/useCreateUser.ts
import { addUserAction } from "@repo/actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateUser = (setError: any) => {
  return useMutation({
    mutationFn: addUserAction,
    onSuccess: (data) => {
      if (data.status === 200 && "user" in data) {
        toast.success("User created successfully!");
        setError({})
      } else if ("error" in data) {
        console.log(data);
        setError(data.fieldErrors)
        toast.error(data.error);
      } else {
        toast.error("Something went wrong");
      }
    },

    onError: () => {
      toast.error("Unexpected error");
    },
  });
      
};
