// @repo/query-hook/src/hooks/useCreateUser.ts
import { addUserAction } from "@repo/actions";
import { useMutation } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: async (form: Credentials) => {
      const res = await fetch("http://localhost:5000/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) {
        const err = await res.json();
        console.log(err)
        throw new Error(err.error || "Login failed");
      }
      const response = await res.json();
      
      return response;
    },
    onError: (err: any) => {
      toast.error(err.message || "Unexpected Error");
    },
  });
};