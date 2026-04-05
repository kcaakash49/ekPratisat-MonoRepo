// @repo/query-hook/src/hooks/useCreateUser.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


type Credentials = {
  contact: string;
  password: string;
};

type FieldErrorType = {
  email?: string;
  name?: string;
  contact?: string;
  password?: string;
};

type ErrorType = {
  error?: string;
  fieldErrors?: FieldErrorType;
}


export const useCreateUser = () => {
  return useMutation<any,ErrorType,FormData>({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/create-agent`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw data as ErrorType;
      }

      return data;
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