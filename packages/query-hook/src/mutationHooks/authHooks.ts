// @repo/query-hook/src/hooks/useCreateUser.ts
import { addUserAction } from "@repo/actions";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";


type Credentials = {
  contact: string;
  password: string;
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: addUserAction,
    onError: () => {
      toast.error("Unexpected error");
    },
  });
      
};

export const useSignInUser = () => {
  return useMutation ({
    mutationFn: async(form: Credentials) => {
      const result = await signIn("credentials", {
        redirect:false,
        contact: form.contact,
        password: form.password
      })
      return result;
    },
    onError: () => {
      toast.error("Unexpected Error");
    }
  })
}