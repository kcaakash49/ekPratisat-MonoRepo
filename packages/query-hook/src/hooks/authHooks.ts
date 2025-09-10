// @repo/query-hook/src/hooks/useCreateUser.ts
import { addUserAction } from "@repo/actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateUser = () => {
//   return useMutation({
//     mutationFn: addUserAction,
//     onSuccess: (data) => {
//       if (data.status === 200 && "user" in data) {
//         toast.success("User created successfully!");
//       } else if ("error" in data) {
//         toast.error(data.error);
//       } else {
//         toast.error("Something went wrong");
//       }
//     },

//     onError: () => {
//       toast.error("Unexpected error");
//     },
//   });

    return useMutation({
        mutationFn: addUserAction,
        onSuccess: (data) => {
          toast.success("User created successfully!");
        },
        onError: (error: any) => {
          toast.error(error.message ?? "Unexpected error");
        }
      })
      
};
